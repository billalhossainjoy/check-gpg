import axios from "axios";
import "dotenv/config";

const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = "main",
} = process.env;

describe("GitHub Branch Protection – Pull Request Reviews", () => {
    it("should require pull request reviews before merging", async () => {
        expect(GITHUB_TOKEN).toBeTruthy();
        expect(GITHUB_OWNER).toBeTruthy();
        expect(GITHUB_REPO).toBeTruthy();

        const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/${GITHUB_BRANCH}/protection`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
            validateStatus: () => true,
        });

        console.log("URL:", url);
        console.log("Status:", response.status);
        console.log("Response:", response.data);

        // ---- Proper error handling ----
        if (response.status === 404) {
            if (response.data?.message === "Branch not protected") {
                throw new Error("❌ Branch exists but protection is NOT enabled");
            }

            throw new Error("❌ Repository or branch NOT FOUND (check owner/repo/branch)");
        }

        if (response.status === 403) {
            throw new Error("❌ Forbidden: Token missing Administration: Read permission");
        }

        // ---- Actual assertion ----
        const reviews = response.data.required_pull_request_reviews;

        expect(reviews).toBeTruthy();
        expect(reviews.required_approving_review_count).toBeGreaterThanOrEqual(1);

        console.log("✅ Pull request review protection is enabled");
    });
});
