import axios from "axios";
import "dotenv/config";

const {
    GITHUB_TOKEN,
    GITHUB_OWNER,
    GITHUB_REPO,
    GITHUB_BRANCH = "main",
} = process.env;

