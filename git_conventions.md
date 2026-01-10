# Git Conventions

## ✅ 1. Conventional Commits

We use Conventional Commits to make commit history readable and support automation.

**Format:**

```
<type>[optional scope]: <short description>

[optional body]

[optional footer(s)]
```

**Examples:**

```bash
feat(auth): add login endpoint
fix(api): correct 500 error when payload is empty
chore: update dependencies
docs(readme): improve installation guide
refactor(user): simplify name parsing logic
```

### Common Types:

* `feat`: New feature
* `fix`: Bug fix
* `docs`: Documentation only changes
* `style`: Code formatting (e.g. missing semi-colons, white space)
* `refactor`: Code change that neither fixes a bug nor adds a feature
* `perf`: Code change that improves performance
* `test`: Adding or correcting tests
* `build`: Changes to build system or external dependencies
* `ci`: Changes to CI configuration files
* `chore`: Maintenance tasks (e.g., dependency upgrades)

## 🌿 2. Branch Naming Convention

Use the following structure for creating branches:

```
<type>/<issue-number>-<short-description>
```

**Types:**
* `feature`: For new features
* `bugfix`: For fixing bugs
* `hotfix`: For urgent fixes in production
* `chore`: For chores and maintenance
* `docs`: For documentation updates
* `refactor`: For code restructuring

**Examples:**
* `feature/123-add-user-authentication`
* `bugfix/89-fix-login-crash`
* `docs/101-update-api-docs`
* `refactor/77-cleanup-user-service`

## 🔁 Recommended Workflow

1. **Create a branch:**

```bash
git checkout -b feature/123-add-user-authentication
```

2. **Commit using Conventional Commits:**

```bash
git commit -m "feat(auth): add JWT-based login"
```

3. **Push your branch:**

```bash
git push origin feature/123-add-user-authentication
```

4. **Open a Pull Request (PR)** with a meaningful title and description.