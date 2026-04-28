# ── Branch Protection ────────────────────────────────
# Require CI to pass before merging PRs into main
# Apply these settings via GitHub Settings or gh CLI:
#
#   gh api repos/manigandanp/hello-world-node/branches/main/protection \
#     -X PUT \
#     -f required_status_checks='{"strict":true,"contexts":["Lint & Test"]}' \
#     -f enforce_admins=true \
#     -f required_pull_request_reviews='{"dismiss_stale_reviews":true,"require_code_owner_reviews":false,"required_approving_review_count":1}' \
#     -f restrictions=null