import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  deleteDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { LocationItem, Review, Report, Category, ReviewStatus } from '../types';
import { INITIAL_LOCATIONS, INITIAL_REVIEWS, INITIAL_CATEGORIES } from '../utils/seedData';

interface DataContextType {
  locations: LocationItem[];
  reviews: Review[];
  reports: Report[];
  categories: Category[];
  loading: boolean;
  addLocation: (loc: Omit<LocationItem, 'id' | 'createdAt' | 'averageRating' | 'reviewCount' | 'verificationStatus' | 'isActive'>) => Promise<string>;
  approveLocation: (id: string) => Promise<void>;
  rejectLocation: (id: string, reason?: string) => Promise<void>;
  addReview: (locationId: string, rating: number, comment: string, userId: string, userName: string, userPhoto?: string) => Promise<void>;
  approveReview: (reviewId: string) => Promise<void>;
  rejectReview: (reviewId: string, reason?: string) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  addReport: (targetType: 'location' | 'review', targetId: string, reason: string, description?: string, reportedBy?: string, reportedByName?: string, targetTitle?: string) => Promise<void>;
  updateReportStatus: (reportId: string, status: 'REVIEWED' | 'RESOLVED' | 'DISMISSED', adminUid?: string) => Promise<void>;
  getLocationById: (id: string) => LocationItem | undefined;
  getReviewsByLocationId: (locationId: string, includePendingForUser?: string) => Review[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<LocationItem[]>(INITIAL_LOCATIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [reports, setReports] = useState<Report[]>([
    {
      id: 'rep-1',
      reportedBy: 'user-2',
      reportedByName: 'David Miller',
      targetType: 'location',
      targetId: 'loc-8',
      targetTitle: 'Bus Connectivity Point',
      reason: 'Outdated timing schedule',
      description: 'The bus times listed in the description changed after last week\'s route update.',
      status: 'OPEN',
      createdAt: '2026-08-29T11:00:00Z',
    }
  ]);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [loading, setLoading] = useState<boolean>(true);

  // Real-time Firestore subscriptions if configured
  useEffect(() => {
    if (!isFirebaseConfigured || !db.collection) {
      setLoading(false);
      return;
    }

    try {
      const locUnsub = onSnapshot(collection(db, 'locations'), (snapshot) => {
        const docsData: LocationItem[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        } as LocationItem));
        if (docsData.length > 0) setLocations(docsData);
      });

      const revUnsub = onSnapshot(collection(db, 'reviews'), (snapshot) => {
        const docsData: Review[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        } as Review));
        if (docsData.length > 0) setReviews(docsData);
      });

      const repUnsub = onSnapshot(collection(db, 'reports'), (snapshot) => {
        const docsData: Report[] = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        } as Report));
        if (docsData.length > 0) setReports(docsData);
      });

      setLoading(false);
      return () => {
        locUnsub();
        revUnsub();
        repUnsub();
      };
    } catch (e) {
      console.warn('Firestore subscription warning:', e);
      setLoading(false);
    }
  }, []);

  // Recalculates location average rating strictly from APPROVED reviews
  const recalculateLocationRating = (locId: string, currentReviews: Review[]) => {
    const approvedReviews = currentReviews.filter(r => r.locationId === locId && r.status === 'APPROVED');
    const count = approvedReviews.length;
    const avg = count === 0 ? 0 : Number((approvedReviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1));

    setLocations(prev => prev.map(l => l.id === locId ? { ...l, averageRating: avg, reviewCount: count } : l));

    if (isFirebaseConfigured && db.collection) {
      try {
        updateDoc(doc(db, 'locations', locId), {
          averageRating: avg,
          reviewCount: count,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        console.warn('Firestore update rating error:', err);
      }
    }
  };

  const addLocation = async (locData: Omit<LocationItem, 'id' | 'createdAt' | 'averageRating' | 'reviewCount' | 'verificationStatus' | 'isActive'>) => {
    const newLoc: LocationItem = {
      ...locData,
      id: `loc-${Date.now()}`,
      createdAt: new Date().toISOString(),
      verificationStatus: 'PENDING', // Always PENDING upon community submission
      averageRating: 0,
      reviewCount: 0,
      isActive: true,
    };

    if (isFirebaseConfigured && db.collection) {
      const docRef = await addDoc(collection(db, 'locations'), {
        ...locData,
        createdAt: new Date().toISOString(),
        verificationStatus: 'PENDING',
        averageRating: 0,
        reviewCount: 0,
        isActive: true,
      });
      newLoc.id = docRef.id;
    }

    setLocations(prev => [newLoc, ...prev]);
    return newLoc.id;
  };

  const approveLocation = async (id: string) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, verificationStatus: 'APPROVED' } : l));
    if (isFirebaseConfigured && db.collection) {
      await updateDoc(doc(db, 'locations', id), { verificationStatus: 'APPROVED', updatedAt: new Date().toISOString() });
    }
  };

  const rejectLocation = async (id: string, reason?: string) => {
    setLocations(prev => prev.map(l => l.id === id ? { ...l, verificationStatus: 'REJECTED', rejectionReason: reason } : l));
    if (isFirebaseConfigured && db.collection) {
      await updateDoc(doc(db, 'locations', id), { verificationStatus: 'REJECTED', rejectionReason: reason, updatedAt: new Date().toISOString() });
    }
  };

  const addReview = async (locationId: string, rating: number, comment: string, userId: string, userName: string, userPhoto?: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      locationId,
      userId,
      userName,
      userPhoto,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      status: 'PENDING', // Submissions require Admin approval!
    };

    let updatedRevs = [newRev, ...reviews];
    if (isFirebaseConfigured && db.collection) {
      const docRef = await addDoc(collection(db, 'reviews'), newRev);
      newRev.id = docRef.id;
      updatedRevs = [newRev, ...reviews];
    }

    setReviews(updatedRevs);
    recalculateLocationRating(locationId, updatedRevs);
  };

  const approveReview = async (reviewId: string) => {
    const updatedRevs = reviews.map(r => r.id === reviewId ? { ...r, status: 'APPROVED' as ReviewStatus } : r);
    setReviews(updatedRevs);
    
    const rev = reviews.find(r => r.id === reviewId);
    if (rev) {
      recalculateLocationRating(rev.locationId, updatedRevs);
    }

    if (isFirebaseConfigured && db.collection) {
      await updateDoc(doc(db, 'reviews', reviewId), { status: 'APPROVED', updatedAt: new Date().toISOString() });
    }
  };

  const rejectReview = async (reviewId: string, reason?: string) => {
    const updatedRevs = reviews.map(r => r.id === reviewId ? { ...r, status: 'REJECTED' as ReviewStatus, rejectionReason: reason } : r);
    setReviews(updatedRevs);

    const rev = reviews.find(r => r.id === reviewId);
    if (rev) {
      recalculateLocationRating(rev.locationId, updatedRevs);
    }

    if (isFirebaseConfigured && db.collection) {
      await updateDoc(doc(db, 'reviews', reviewId), { status: 'REJECTED', rejectionReason: reason, updatedAt: new Date().toISOString() });
    }
  };

  const deleteReview = async (reviewId: string) => {
    const revToDelete = reviews.find(r => r.id === reviewId);
    const updatedRevs = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedRevs);

    if (revToDelete) {
      recalculateLocationRating(revToDelete.locationId, updatedRevs);
    }

    if (isFirebaseConfigured && db.collection) {
      await deleteDoc(doc(db, 'reviews', reviewId));
    }
  };

  const addReport = async (
    targetType: 'location' | 'review', 
    targetId: string, 
    reason: string, 
    description?: string, 
    reportedBy: string = 'anon-user',
    reportedByName: string = 'Community Member',
    targetTitle?: string
  ) => {
    const newRep: Report = {
      id: `rep-${Date.now()}`,
      reportedBy,
      reportedByName,
      targetType,
      targetId,
      targetTitle,
      reason,
      description,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    if (isFirebaseConfigured && db.collection) {
      const docRef = await addDoc(collection(db, 'reports'), newRep);
      newRep.id = docRef.id;
    }

    setReports(prev => [newRep, ...prev]);
  };

  const updateReportStatus = async (reportId: string, status: 'REVIEWED' | 'RESOLVED' | 'DISMISSED', adminUid?: string) => {
    const now = new Date().toISOString();
    setReports(prev => prev.map(r => r.id === reportId ? { ...r, status, resolvedAt: now, resolvedBy: adminUid } : r));
    if (isFirebaseConfigured && db.collection) {
      await updateDoc(doc(db, 'reports', reportId), { status, resolvedAt: now, resolvedBy: adminUid });
    }
  };

  const getLocationById = (id: string) => locations.find(l => l.id === id);

  const getReviewsByLocationId = (locationId: string, includePendingForUser?: string) => {
    return reviews.filter(r => {
      if (r.locationId !== locationId) return false;
      // Show APPROVED reviews publicly. If the user authored a PENDING review, show it to them as well.
      if (r.status === 'APPROVED') return true;
      if (includePendingForUser && r.userId === includePendingForUser) return true;
      return false;
    });
  };

  return (
    <DataContext.Provider value={{
      locations,
      reviews,
      reports,
      categories,
      loading,
      addLocation,
      approveLocation,
      rejectLocation,
      addReview,
      approveReview,
      rejectReview,
      deleteReview,
      addReport,
      updateReportStatus,
      getLocationById,
      getReviewsByLocationId
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
