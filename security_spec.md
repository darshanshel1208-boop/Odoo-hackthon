# Traveloop Security Specification

## Data Invariants
1. A trip must be owned by the user who created it and can only be accessed/modified by the owner.
2. Stops, Activities, and Checklist Items belong to a Trip and inherit its access control.
3. Users cannot update immutable fields like `uid` or `ownerId`.
4. All writes must follow strict schema validation.
5. All IDs must be valid (alphanumeric, max length).

## The Dirty Dozen Payloads (Attempted Vulnerabilities)
1. **Identity Spoofing**: Attempt to create a trip for another user id.
2. **Resource Poisoning**: Attempt to inject 2KB string as a trip id.
3. **Ghost Field Update**: Attempt to add `admin: true` to a user profile.
4. **Relationship Break**: Attempt to add a stop to a trip owned by someone else.
5. **Unauthorized Read**: Attempt to list another user's trips.
6. **Orphaned Write**: Attempt to create an activity for a non-existent stop id.
7. **Negative Cost**: Attempt to set an activity cost to -500.
8. **Invalid Date**: Attempt to set departure date before arrival date.
9. **Spam Content**: Attempt to create 10,000 checklist items in one trip (not easily rule-checked but size checks help).
10. **Immutable Field Change**: Attempt to change `ownerId` of an existing trip.
11. **Spoofed Email**: Attempt to access admin features (if any) with an unverified email.
12. **PII Leak**: Attempt to read user email of another user.

## Security Rules Draft (DRAFT_firestore.rules)
... (to be generated)
