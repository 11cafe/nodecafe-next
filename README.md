# nodecafe.org

A ComfyUI custom nodes package manager. www.nodecafe.org/

Hope this can be the Pypi or npm for comfyui custom nodes. To provide all custom nodes latest metrics and status, streamline custom nodes auto installations error-free. And provide some standards and guardrails for custom nodes development and release.

- Frontend+backend: Nextjs
- Storage: S3
- Database: Dynamodb
- Auth: Nextauth

Still cleaning up some code so some files are not commited in repo yet.

<img width="800" alt="Screenshot 2024-04-12 at 4 49 22 PM" src="https://github.com/11cafe/nodecafe-next/assets/18367033/0d28dc57-fa4c-48c3-8f98-9a426b58cdb7">


## Dev

1. Clone the repository locally. Since there are submodules, use the command:

   ```
   git clone --recursive https://github.com/11cafe/nodecafe-next
   ```

2. Install dependencies

   ```
   npm install
   ```

3. then symlink ComfyUI/web to public/web
   `ln -s /path/to/your/project/comfyui-fork/web /path/to/your/project/public/web`
4. Add the .env.local file in the root directory of the warehouse and paste the
   following content into .env.local

   ```
   AWS_ACCESS_KEY_ID=XXX
   AWS_SECRET_ACCESS_KEY=XXX
   AWS_REGION=us-west-1
   AWS_OPENSEARCH_DOMAIN=https://search-amplify-opense-xxx.us-west-1.es.amazonaws.com
   DDB_TABLE_POSTFIX=-u66pcvc7szb5tjn7j44exgi2gq-prod
   GITHUB_API_KEY=YOUR_GITHU_API_KEY
   GITHUB_OAUTH_CLIENT_ID=PROD_ID
   GITHUB_OAUTH_CLIENT_SECRET=PROD_SECRET
   GITHUB_OAUTH_CLIENT_ID_LOCALHOST=xyz
   GITHUB_OAUTH_CLIENT_SECRET_LOCALHOST=xyz
   NEXTAUTH_SECRET=XXX
   ```

5. Apply for an AWS IAM account from the warehouse manager, create an access key
   after logging in, and fill it in .env.local;
6. Start the project

   ```
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.
