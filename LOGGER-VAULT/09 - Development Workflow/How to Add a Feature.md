# 🔨 How to Add a Feature to Logger

> **Tag**: #workflow #guide #features
> **Related Notes**: [[AI Development Rules]], [[How to Test Changes]]

1. **Architecture Check**: Identify whether the feature touches the frontend (`index.html`), the edge proxy (`worker/src/index.js`), or local server (`server.js`).
2. **Design Token Consistency**: Use existing `:root` custom properties for colors, shadows, radii, and typography.
3. **Draft the Implementation**:
   - If adding a modal or overlay, append the HTML markup inside `<body>` before `<script>`.
   - Add styles inside the `<style>` block.
   - Add module script logic inside the `<script type="module">` block.
4. **Test Syntax**: Compile the script via `node -e` to ensure no syntax errors.
5. **Update Vault**: Document the new feature in `02 - Features/` and update [[Feature Inventory]].
