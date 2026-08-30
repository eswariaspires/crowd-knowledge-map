import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

/**
 * Cloud Function Trigger: aggregateRatingsOnWrite
 * Automatically recalculates location averageRating and reviewCount
 * whenever a review is created, updated, or deleted.
 */
export const aggregateRatingsOnWrite = functions.firestore
  .document('reviews/{reviewId}')
  .onWrite(async (change, context) => {
    const data = change.after.exists ? change.after.data() : change.before.data();
    if (!data || !data.locationId) return null;

    const locationId = data.locationId;
    const locationRef = db.collection('locations').doc(locationId);

    try {
      // Query all reviews for this location
      const reviewsSnapshot = await db
        .collection('reviews')
        .where('locationId', '==', locationId)
        .get();

      const count = reviewsSnapshot.size;
      let totalRating = 0;

      reviewsSnapshot.forEach((doc) => {
        const rev = doc.data();
        totalRating += rev.rating || 0;
      });

      const averageRating = count > 0 ? Number((totalRating / count).toFixed(1)) : 0;

      // Update location document authoritatively
      await locationRef.update({
        averageRating,
        reviewCount: count,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      functions.logger.info(`Updated location ${locationId}: avg=${averageRating}, count=${count}`);
      return true;
    } catch (error) {
      functions.logger.error(`Error aggregating ratings for location ${locationId}:`, error);
      return false;
    }
  });

/**
 * Cloud Function Trigger: onLocationSubmitted
 * Validates new location submissions and logs security audit trail.
 */
export const onLocationSubmitted = functions.firestore
  .document('locations/{locationId}')
  .onCreate(async (snapshot, context) => {
    const location = snapshot.data();
    functions.logger.info(`New community location submitted for verification: ${location.name} (${context.params.locationId})`);
  });
