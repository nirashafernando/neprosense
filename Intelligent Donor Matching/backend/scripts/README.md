# Database Management Scripts

## 🎯 Quick Start

### Clear and Seed Database (Recommended)
```bash
npm run db:reset
```
This will:
1. Clear all existing data (donors, recipients, predictions)
2. Seed 10 realistic Sri Lankan donors
3. Seed 10 realistic Sri Lankan recipients
4. Create test clinician account

---

## 📋 Available Commands

### 1. Reset Database (Clear + Seed)
```bash
npm run db:reset
```
**Use this when:** Starting fresh with test data

### 2. Clear Database Only
```bash
npm run db:clear
```
**Use this when:** You want to remove all data without seeding

### 3. Seed Database Only
```bash
npm run db:seed
```
**Use this when:** Database is already clear and you just want to add test data

---

## 👥 Test Data Details

### Test User Credentials
- **Email:** `doctor@nephrosense.lk`
- **Password:** `doctor123`
- **Role:** Clinician
- **Name:** Dr. Kumara Wijeratne

### 10 Sri Lankan Donors
| ID | Name | Age | Blood Group | Location | Hospital |
|----|------|-----|-------------|----------|----------|
| D001 | Kasun Perera | 32 | O+ | Colombo | National Hospital of Sri Lanka |
| D002 | Nimal Fernando | 28 | A+ | Kandy | Teaching Hospital Kandy |
| D003 | Chamari Silva | 35 | B+ | Galle | Karapitiya Teaching Hospital |
| D004 | Ranil Wickramasinghe | 45 | AB+ | Negombo | Negombo General Hospital |
| D005 | Priyanka Jayawardena | 29 | O+ | Anuradhapura | Anuradhapura Teaching Hospital |
| D006 | Roshan de Silva | 38 | A+ | Kurunegala | Kurunegala Teaching Hospital |
| D007 | Malini Rathnayake | 42 | B+ | Jaffna | Jaffna Teaching Hospital |
| D008 | Lakshan Gunasekara | 50 | O+ | Matara | Matara General Hospital |
| D009 | Sanduni Wijesinghe | 26 | AB+ | Batticaloa | Batticaloa Teaching Hospital |
| D010 | Thilina Bandara | 33 | A+ | Ratnapura | Ratnapura General Hospital |

### 10 Sri Lankan Recipients
| ID | Name | Age | Blood Group | Location | Dialysis Years | Urgency |
|----|------|-----|-------------|----------|----------------|---------|
| R001 | Samanthi Rajapaksa | 45 | O+ | Colombo | 3.5 | 75 |
| R002 | Anil Dissanayake | 52 | A+ | Kandy | 5.2 | 85 |
| R003 | Nuwan Karunaratne | 38 | B+ | Galle | 2.8 | 68 |
| R004 | Dilini Amarasinghe | 41 | AB+ | Negombo | 4.0 | 78 |
| R005 | Chathura Mendis | 29 | O+ | Anuradhapura | 1.5 | 55 |
| R006 | Hasini Jayakody | 48 | A+ | Kurunegala | 6.5 | 88 |
| R007 | Ranjith Herath | 55 | B+ | Jaffna | 7.8 | 92 |
| R008 | Chaminda Wickremaratne | 35 | O+ | Matara | 2.2 | 62 |
| R009 | Thanuja Edirisinghe | 60 | AB+ | Batticaloa | 8.5 | 95 |
| R010 | Sunil Gamage | 44 | A+ | Ratnapura | 3.8 | 72 |

---

## 🏥 Geographic Distribution

**Donors across Sri Lanka:**
- Colombo (National Hospital)
- Kandy (Teaching Hospital)
- Galle (Karapitiya)
- Negombo (General Hospital)
- Anuradhapura (Teaching Hospital)
- Kurunegala (Teaching Hospital)
- Jaffna (Teaching Hospital)
- Matara (General Hospital)
- Batticaloa (Teaching Hospital)
- Ratnapura (General Hospital)

---

## 🩸 Blood Group Distribution

### Donors
- **O+**: 3 donors (D001, D005, D008)
- **A+**: 3 donors (D002, D006, D010)
- **B+**: 2 donors (D003, D007)
- **AB+**: 2 donors (D004, D009)

### Recipients
- **O+**: 3 recipients (R001, R005, R008)
- **A+**: 3 recipients (R002, R006, R010)
- **B+**: 2 recipients (R003, R007)
- **AB+**: 2 recipients (R004, R009)

---

## 🧬 Medical Data Characteristics

### Donors (Healthy Profiles)
- **Age Range:** 26-50 years
- **BMI Range:** 21.8-27.5
- **GFR Range:** 85-118 mL/min/1.73m² (Normal to Excellent)
- **Comorbidities:** Minimal (1 with diabetes, 2 with hypertension, 1 smoker)

### Recipients (CKD Patients)
- **Age Range:** 29-60 years
- **BMI Range:** 22.5-30.5
- **GFR Range:** 5-18 mL/min/1.73m² (Stage 5 CKD)
- **Dialysis:** 1.5-8.5 years
- **Urgency Scores:** 55-95 (varying severity)
- **Comorbidities:** Most have diabetes and/or hypertension

---

## 🔬 HLA Typing Examples

All donors and recipients have realistic HLA typing with 6 antigens (A, B, DR):

**Example Matches:**
- **Perfect 6/6 Match:** D001 (A1,A2,B8,B44,DR1,DR4)
- **Good 5/6 Match:** D002 (A1,A3,B7,B8,DR3,DR4)
- **Medium 4/6 Match:** D003 (A2,A3,B7,B35,DR3,DR7)
- **Lower 3/6 Match:** D008 (A1,A3,B7,B35,DR3,DR4)

---

## ⚠️ Important Notes

1. **Data Persistence:** These scripts will **permanently delete** all existing data before seeding
2. **Test Environment:** This data is for **testing and development only**
3. **Realistic Values:** All medical parameters are within realistic clinical ranges
4. **Sri Lankan Context:** Names, locations, and hospitals are authentic Sri Lankan references
5. **User Creation:** Test clinician account is created automatically

---

## 🚀 Workflow

### Initial Setup
```bash
# 1. Ensure MongoDB is running
# 2. Environment variables are configured (.env file)
# 3. Run the reset script
npm run db:reset
```

### Development Cycle
```bash
# When you need fresh data:
npm run db:reset

# When you want to clear everything:
npm run db:clear

# When you only need to add data (assuming DB is clear):
npm run db:seed
```

---

## 📊 Expected Output

```
🔄 Connecting to MongoDB...
🗑️  Clearing existing data...
✅ Existing data cleared

👨‍⚕️ Creating test clinician user...
✅ Test user created: doctor@nephrosense.lk / doctor123

👥 Seeding 10 Sri Lankan donors...
✅ Successfully seeded 10 donors

🏥 Seeding 10 Sri Lankan recipients...
✅ Successfully seeded 10 recipients

📊 SEEDING SUMMARY
════════════════════════════════════════════════════════════
✅ Total Donors: 10
✅ Total Recipients: 10
👨‍⚕️ Test User: doctor@nephrosense.lk
🔑 Password: doctor123
════════════════════════════════════════════════════════════

✨ Database seeded successfully with Sri Lankan test data!
🚀 You can now login and start making predictions.
```

---

## 🛠️ Troubleshooting

### Error: "Cannot connect to MongoDB"
**Solution:** Ensure MongoDB is running and MONGODB_URI in .env is correct

### Error: "User validation failed"
**Solution:** Clear the User collection manually or check for duplicate emails

### Error: "Module not found"
**Solution:** Run `npm install` to ensure all dependencies are installed

### Script hangs without output
**Solution:** Check MongoDB connection string and network connectivity

---

## 📝 Data Validation

After seeding, verify data in MongoDB:

```javascript
// In MongoDB shell or Compass
db.donors.count()     // Should return 10
db.recipients.count() // Should return 10
db.users.findOne({ email: 'doctor@nephrosense.lk' }) // Should exist
```

Or use the frontend application:
1. Login with `doctor@nephrosense.lk` / `doctor123`
2. Navigate to Donors tab → Should see 10 donors
3. Navigate to Recipients tab → Should see 10 recipients
4. Try creating a prediction

---

**🏥 NephroSense Database Management** - Realistic Sri Lankan Test Data for Development

**Last Updated:** February 2026
