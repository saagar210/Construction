# Decisions

# Decisions

## 2026-02-10
1. **Expose toolbox route/nav before deeper feature expansion**
   - Rationale: safest high-value delta with existing code already present.
   - Alternatives rejected: implementing full toolbox detail/new routes in this iteration (scope/risk too large).
2. **Add focused navigation regression test**
   - Rationale: protects discoverability without introducing brittle integration test scaffolding.

3. **Implement lightweight functional toolbox sub-routes instead of placeholders**
   - Rationale: route links already existed in list page; providing real flows avoids dead navigation while staying scoped.
   - Alternatives rejected: placeholder pages with TODO text.
4. **Add JSA page as minimal operational slice (list + create)**
   - Rationale: align nav discoverability with existing backend commands without broad domain refactor.
