# READ ME – EECS4413 – TEAM TWO

## 1 Source code repository (GitHub): 
[https://github.com/hastighsh/Online_Shopping_Cart](https://github.com/hastighsh/Online_Shopping_Cart)

### 1.1 SQL Script File 
(See instructions for database setup at 4.2, or more specifically 4.2.2 for database setup using the SQL script commands)

`teamtwo-4413SQLCommands.sql`

## 2 Online Project URL: 
[https://online-shopping-cart-eta.vercel.app/](https://online-shopping-cart-eta.vercel.app/)

## 3 Admin Credentials (email / password):  

### 3.1 LocalHost Admin Credentials 
`admin@gmail.com` / `Blackbird2!`

### 3.2 Production Environment Admin Credentials 
`admin@gmail.com` / `Blackbird2!`  
`admin3@gmail.com` / `Admin123!`

## 4 Instructions for LOCALHOST setup:  

### 4.1 LOCALHOST Application Setup  

#### Prerequisites: 
- Download Node.js: [https://nodejs.org/en](https://nodejs.org/en) (leave in default directory: `C:\Program Files\nodejs`)
- To run the local database, you’ll need to install PostgreSQL 16.6 ([https://www.postgresql.org/download/](https://www.postgresql.org/download/) and include pgAdmin4). Otherwise, there is the option to access the remote production database, but it is preferred that you do not as any changes to it may alter the production environment of the project (and will be reflected in the live environment). 

#### Steps: 
1. Go to the GitHub repo, click the green button `<>Code` and download it as ZIP.  
2. Unzip file and open it in Visual Studio Code (as administrator).  
3. In Visual Studio Code select “Open Folder” and then click on the un-zipped project folder `Online_Shopping_Cart-main`.  
4. Ensure that the NPM path variable is properly set (if on Windows, and if you haven’t installed/used nodejs before, otherwise visit [https://www.geeksforgeeks.org/how-to-fix-npm-path-in-windows-8-and-10/](https://www.geeksforgeeks.org/how-to-fix-npm-path-in-windows-8-and-10/) for instructions).  
5. If your system is not able to run scripts, input the following command in the VS code terminal:  
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
   ```  
6. From the project’s `\onlinestore\` directory  
   `Online_Shopping_Cart-main\Online_Shopping_Cart-main\onlinestore\`  
   run the following command in the VS terminal:  
   ```bash
   npm install
   ```  
7. Go to step 4.2 to setup the database for the project and connect either to the localhost database or the one for the production environment. As you have downloaded the source code file, by default in the `.env` file the connection string is presented for localhost database access once you have performed the necessary actions to download PostgreSQL.  
8. Once nodejs is installed, run the command in the VS code terminal in the same directory to get the application up and running:  
   ```bash
   npm run dev
   ```  
9. The application will start and can be found at [http://localhost:3000/](http://localhost:3000/).  
10. Every time you want the application to run after exiting, you will need to run the command `npm run dev` from the `\onlinestore\` directory in VScode.  

### 4.2 Database Setup  

There is the option to have a local database with PgAdmin4 (sections 4.2.1 and sections 4.2.2) or to use the connection string to connect to the production environment database (section 4.2.3), although it is preferable that you initiate a localhost database as any changes you wish to make will not only affect the localhost environment but also the production environment.  

#### 4.2.1 LOCAL DATABASE Setup using .backup file in PgAdmin4  
1. Install PostgreSQL 16.6 at: [https://www.postgresql.org/download/](https://www.postgresql.org/download/).  
2. During installation leave all default components selected (ensure pgAdmin4 is checked).  
3. For the database superuser password choose: `eecs4413`.  
4. For the port number, leave the default `5432`.  
5. (You have the option to use the `.backup` file or SQL scripts. If you wish to use SQL scripts, jump to section 4.2.2, or continue).  
6. Open Pgadmin4. Under PostgreSQL 16 > Databases > postgres, right-click and do Restore.  
7. Choose the database `.backup` file provided with the source code that is named `teamtwo-4413localdatabase.backup` (alternatively you can download it from GitHub again at this link).  
8. If you used a different password or port number for PostgreSQL, you’ll need to update it in the `.env` file of the project on VSCode. As is, this is the default connection string for localhost PostgreSQL database:  
   ```plaintext
   DATABASE_URL=postgresql://postgres:eecs4413@localhost:5433/postgres
   ```  
9. In VSCode, in the directory `Online_Shopping_Cart-main\Online_Shopping_Cart-main\onlinestore\` do the command to sync the database:  
   ```bash
   npx prisma db pull
   ```  
10. Then, start the application with the below command and you will see that the products are populated in the Catalog when you go to [http://localhost:3000/](http://localhost:3000/):  
    ```bash
    npm run dev
    ```

#### 4.2.2 LOCAL DATABASE Setup using SQL Scripts in PgAdmin4  
1. Picking up from part of section 4.2.1, under PostgreSQL 16 > Databases > postgres > Schemas > Tables  
2. Right-click ‘Tables’ and choose the option PSQL TOOL.  
3. Open the SQL Script/Commands file called `teamtwo-4413SQLCommands.sql` that was provided when you downloaded the source code (alternatively you can download it from GitHub again at this link) and open the file with a notepad to reveal the SQL scripts/commands.  
4. Copy and paste all the contents of the text file into the PSQL Tool window of pgAdmin4. This will populate all the tables and all data for the database.  
5. If you used a different password or port number for PostgreSQL, you’ll need to update it in the `.env` file of the project on VSCode. As is, this is the default connection string for localhost PostgreSQL database:  
   ```plaintext
   DATABASE_URL=postgresql://postgres:eecs4413@localhost:5433/postgres
   ```  
6. In VSCode, in the directory `Online_Shopping_Cart-main\Online_Shopping_Cart-main\onlinestore\` do the command to sync the database:  
   ```bash
   npx prisma db pull
   ```  
7. Then, start the application with the below command and you will see that the products are populated in the Catalog when you go to [http://localhost:3000/](http://localhost:3000/):  
   ```bash
   npm run dev
   ```

#### 4.2.3 Access to Production Database [WARNING – ANY ACTIONS YOU TAKE WITH THE PRODUCTION DATABASE MAY NEGATIVELY AFFECT OUR PRODUCTION ENVIRONMENT. PLEASE USE THE LOCAL DATABASE SETUP IF YOU PLAN TO MAKE ANY CHANGES WITH THE DATABASE FOR ANY REASON]  

The following is the Connection String to the production URL of the database. By default, this value has not been set in the `.env` file because any changes you make to the db (adding products or users) will be done to the production environment as well. However, this method is easiest for connecting to the production environment database.  

1. In the `.env` file, change the `DATABASE_URL` to be:  
   ```plaintext
   DATABASE_URL=postgresql://postgres:OLeubWgBWkvyBMtmHMBoMlqDivVlsYnn@junction.proxy.rlwy.net:14595/railway
   ```  
2. Run this command in the VScode terminal:  
   ```bash
   npx prisma db pull
   ```  
3. Then run this command to start the application locally at [http://localhost:3000/](http://localhost:3000/):  
   ```bash
   npm run dev
   ```

If you want to see the contents of the Production database (it is preferable you don’t modify
them here as they will affect the live environment), then connect to it from the VSCode
terminal doing the below command – make sure you have the path variables set for psql
(see here for more details if you run into issues setting the path variables with a Windows
device https://stackoverflow.com/questions/30401460/postgres-psql-not-recognized-asan-internal-or-external-command ) :
```bash
psql
postgresql://postgres:OLeubWgBWkvyBMtmHMBoMlqDivVlsYnn@junction.proxy.rlwy.ne
t:14595/railway
```
