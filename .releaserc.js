module.exports = {
    branches: ['main'],
    plugins: [
        ["@semantic-release/commit-analyzer", {
          "releaseRules": [
            { "breaking": true, "release": "major" },
            { "type": "feat", "release": "minor" },
            { "type": "fix", "release": "patch" },
            { "type": "chore", "release": false }
          ],
          "parserOpts": {
            "noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES"]
          }
        }]
    ]
}