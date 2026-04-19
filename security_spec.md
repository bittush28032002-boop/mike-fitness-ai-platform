# Security Specification - Mike Johnson Fitness

## Data Invariants
1. `User Profile`: Only the authenticated owner can read/write their own profile. Roles can only be updated by Admins.
2. `Leads`: Anyone can create a lead (consultation request), but only Admins can read or update them.
3. `Workout Logs`: Only the owner can read/write their workout logs. Logs must belong to the user identified by the path.
4. `Meal Plans`: Only the owner can read/write their meal plans.
5. `Training Plans`: Anyone can read, only Admins can write.

## The "Dirty Dozen" Payloads (Deny Cases)
1. **Identity Spoofing**: User A trying to update User B's profile.
2. **Role Escalation**: User trying to set their own role to 'admin' during signup.
3. **Ghost Fields**: Adding `isVerified: true` to a workout log.
4. **Orphaned Writes**: Creating a workout log for a userId that doesn't match the path.
5. **Unauthorized Discovery**: Non-admin trying to list all Leads.
6. **Path Pollution**: Using a 1MB string as a Lead ID.
7. **Cross-User Leak**: User A trying to `get()` User B's meal plan.
8. **Invalid Status**: Setting a Lead status to 'invalid_state'.
9. **Negative Calories**: Creating a meal plan with -500 calories.
10. **Admin Lockout**: Admin trying to update a Lead but being blocked by own rules (need escape hatch).
11. **Spoofed Creation Date**: User trying to set `createdAt` in the past.
12. **Public PII**: User profile email being readable by any signed-in user.

## Test Runner (Checklist)
- [ ] Profile: `get` fails for other users.
- [ ] Profile: `create` fails if `role` is 'admin' (and user isn't admin).
- [ ] Lead: `list` fails for non-admins.
- [ ] WorkoutLog: `create` fails if `userId` != `request.auth.uid`.
- [ ] Field: `isValidId` enforced on document creation.
