# MongoDB Atlas Setup Guide

## Step 1: Get Your Connection String

1. **Log into MongoDB Atlas**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Sign in with your account

2. **Create/Select Your Cluster**
   - If you haven't created a cluster yet, create a free M0 cluster
   - If you already have a cluster, select it

3. **Get Your Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (it looks like: `mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority`)

4. **Replace Placeholder Values**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Replace `<dbname>` with `portfolio_traffic`

## Step 2: Update Serverless Function

Once you have your connection string, we'll update the serverless function to use MongoDB.

## Step 3: Set Up Netlify Environment Variables

1. **Go to your Netlify dashboard**
2. **Navigate to your site settings**
3. **Go to "Environment variables"**
4. **Add a new variable:**
   - Key: `MONGODB_URI`
   - Value: Your connection string from Step 1

## Step 4: Deploy and Test

After setting up the environment variables, your admin panel will show real visitor data!

---

**Note:** Keep your connection string secure and never commit it to your public repository. 