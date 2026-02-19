---
description: How to push changes from dev to main for production deployment
---

# Workflow: Push from Dev to Main

Use this workflow when you have finished testing your changes on the `dev` branch and are ready to deploy them to production (Netlify).

## Steps

1. **Commit and Push to Dev**
   Ensure all your changes are committed and pushed to the `dev` branch.
   ```bash
   git add .
   git commit -m "your commit message"
   git push origin dev
   ```

2. **Wait for CI/CD (Optional)**
   If you have branch-specific tests or previews, ensure they pass on `dev`.

3. **Switch to Main**
   ```bash
   git checkout main
   ```

4. **Pull Latest Main**
   ```bash
   git pull origin main
   ```

5. **Merge Dev into Main**
   ```bash
   git merge dev
   ```

6. **Push to Main**
   This will trigger the Netlify deployment.
   ```bash
   git push origin main
   ```

7. **Switch back to Dev**
   ```bash
   git checkout dev
   ```
