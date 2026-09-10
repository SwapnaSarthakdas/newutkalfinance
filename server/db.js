import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password Hashing Helper using PBKDF2 (NIST Recommended, 100,000 iterations)
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, storedPassword) {
  if (!storedPassword) return false;
  
  // Support legacy plain-text or demo passwords safely
  if (!storedPassword.includes(':')) {
    return password === storedPassword;
  }

  const [salt, originalHash] = storedPassword.split(':');
  if (!salt || !originalHash) return false;

  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  try {
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(originalHash, 'hex'));
  } catch {
    return false;
  }
}

// Helper to generate IDs
export function generateId(prefix = 'REC') {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${rand}`;
}

// Default initial data for seeding
function getInitialData() {
  const adminSalt = crypto.randomBytes(16).toString('hex');
  const adminHash = crypto.pbkdf2Sync('admin123', adminSalt, 100000, 64, 'sha512').toString('hex');

  return {
    branches: [
      { id: 'BR-001', code: '075101', name: 'Bhubaneswar HQ', district: 'Khurda', state: 'Odisha', manager_name: 'Bhagirathi Mohapatra', phone: '0674-2548900', address: 'Plot 142, VIP Area, Saheed Nagar, Bhubaneswar' },
      { id: 'BR-002', code: '075302', name: 'Cuttack Main Branch', district: 'Cuttack', state: 'Odisha', manager_name: 'Minati Mishra', phone: '0671-2415600', address: 'Buxi Bazar, Near High Court, Cuttack' },
      { id: 'BR-003', code: '076903', name: 'Rourkela Commercial', district: 'Sundargarh', state: 'Odisha', manager_name: 'P. K. Mohanty', phone: '0661-2501200', address: 'Civil Township, Sector 4, Rourkela' },
      { id: 'BR-004', code: '076104', name: 'Berhampur Branch', district: 'Ganjam', state: 'Odisha', manager_name: 'A. K. Sahu', phone: '0680-2223400', address: 'Old Bus Stand Road, Berhampur' },
      { id: 'BR-005', code: '075205', name: 'Puri Grand Road', district: 'Puri', state: 'Odisha', manager_name: 'R. K. Tripathy', phone: '06752-224500', address: 'Grand Road, Near Temple, Puri' }
    ],
    associates: [
      { id: 'ASC-001', code: 'UTK-ASC-101', name: 'Pradeep Kumar Jena', branch_id: 'BR-001', phone: '+91 94370 12345', status: 'Active' },
      { id: 'ASC-002', code: 'UTK-ASC-102', name: 'Manoj Kumar Panda', branch_id: 'BR-002', phone: '+91 94371 67890', status: 'Active' },
      { id: 'ASC-003', code: 'UTK-ASC-103', name: 'Soumya Ranjan Das', branch_id: 'BR-003', phone: '+91 94372 11223', status: 'Active' },
      { id: 'ASC-004', code: 'UTK-ASC-104', name: 'Gitanjali Mohapatra', branch_id: 'BR-001', phone: '+91 94373 44556', status: 'Active' }
    ],
    users: [
      {
        id: 'USR-ADM-001',
        username: 'admin',
        email: 'admin@utkalfinance.com',
        mobile_number: '9861000001',
        emp_id: 'EMP-ADM-001',
        password_hash: `${adminSalt}:${adminHash}`,
        role: 'ADMIN',
        failed_login_attempts: 0,
        locked_until: null,
        created_at: '2024-01-01T00:00:00.000Z'
      },
      {
        id: 'USR-MEM-001',
        username: 'rajesh.sharma',
        email: 'rajesh.sharma@utkalfinance.com',
        mobile_number: '9876543210',
        emp_id: 'EMP-2024-001',
        membership_id: 'UF-2026-1048',
        password_hash: 'member123',
        role: 'MEMBER',
        failed_login_attempts: 0,
        locked_until: null,
        created_at: '2026-08-15T00:00:00.000Z'
      }
    ],
    members: [
      {
        id: 'UF-2026-1048',
        membership_id: 'UF-2026-1048',
        user_id: 'USR-MEM-001',
        application_id: 'APP-2024-1048',
        emp_id: 'EMP-2024-001',
        name: 'Rajesh Sharma',
        first_name: 'Rajesh',
        last_name: 'Sharma',
        father_or_husband_name: 'Sunil Sharma',
        dob: '1990-05-15',
        age: 36,
        gender: 'Male',
        email: 'rajesh.sharma@utkalfinance.com',
        phone: '9876543210',
        mobileNumber: '9876543210',
        branch_id: 'BR-001',
        branch_name: 'Bhubaneswar HQ (Nayapalli, IRC Village)',
        branch_code: '075101',
        account_status: 'Active',
        kyc_status: 'Verified',
        available_balance: 0,
        total_deposits: 0,
        active_loan: 0,
        joined_date: '2026-08-15'
      }
    ],
    membership_applications: [],
    addresses: [],
    nominees: [],
    witnesses: [],
    documents: [],
    share_details: [],
    sessions: [],
    notifications: [],
    audit_logs: []
  };
}

// Database Manager class with ACID Atomic persistence
class Database {
  constructor() {
    this.data = null;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = getInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error loading database, seeding initial data:', err);
      this.data = getInitialData();
      this.save();
    }
  }

  save() {
    try {
      const tempPath = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempPath, JSON.stringify(this.data, null, 2), 'utf8');
      fs.renameSync(tempPath, DB_FILE);
      return true;
    } catch (err) {
      console.error('Error saving database atomically:', err);
      return false;
    }
  }

  table(name) {
    if (!this.data[name]) {
      this.data[name] = [];
    }
    return this.data[name];
  }

  findAll(table, filterFn = null) {
    const list = this.table(table);
    if (!filterFn) return [...list];
    return list.filter(filterFn);
  }

  findById(table, id) {
    const list = this.table(table);
    return list.find((item) => item.id === id) || null;
  }

  findOne(table, filterFn) {
    const list = this.table(table);
    return list.find(filterFn) || null;
  }

  insert(table, record) {
    const list = this.table(table);
    const item = {
      ...record,
      id: record.id || generateId(table.slice(0, 3).toUpperCase()),
      created_at: record.created_at || new Date().toISOString()
    };
    list.unshift(item);
    this.save();
    return item;
  }

  update(table, id, updates) {
    const list = this.table(table);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    list[index] = {
      ...list[index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return list[index];
  }

  delete(table, id) {
    const list = this.table(table);
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return false;

    list.splice(index, 1);
    this.save();
    return true;
  }

  // Audit Logger Helper
  logAudit({ actorId, actorName, actorRole, action, targetType, targetId, details }) {
    return this.insert('audit_logs', {
      id: `AUDIT-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      actor_id: actorId || 'SYSTEM',
      actor_name: actorName || 'System Automated',
      actor_role: actorRole || 'SYSTEM',
      action,
      target_type: targetType,
      target_id: targetId,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // Check Uniqueness across users and members
  checkUniqueness({ email, mobileNumber, empId, membershipId, excludeUserId = null }) {
    const users = this.table('users');
    const cleanEmail = email ? email.trim().toLowerCase() : null;
    const cleanMobile = mobileNumber ? mobileNumber.replace(/\D/g, '').slice(-10) : null;
    const cleanEmp = empId ? empId.trim().toUpperCase() : null;
    const cleanMem = membershipId ? membershipId.trim().toUpperCase() : null;

    for (const u of users) {
      if (excludeUserId && u.id === excludeUserId) continue;

      if (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) {
        return { isUnique: false, field: 'email', message: 'Email address is already registered in our system.' };
      }

      if (cleanMobile && u.mobile_number) {
        const uMobile = u.mobile_number.replace(/\D/g, '').slice(-10);
        if (uMobile === cleanMobile) {
          return { isUnique: false, field: 'mobileNumber', message: 'Mobile number is already registered in our system.' };
        }
      }

      if (cleanEmp && u.emp_id && u.emp_id.toUpperCase() === cleanEmp) {
        return { isUnique: false, field: 'empId', message: 'Employee ID is already registered.' };
      }

      if (cleanMem && u.membership_id && u.membership_id.toUpperCase() === cleanMem) {
        return { isUnique: false, field: 'membershipId', message: 'Membership ID is already assigned.' };
      }
    }

    const members = this.table('members');
    for (const m of members) {
      if (cleanEmp && m.emp_id && m.emp_id.toUpperCase() === cleanEmp) {
        return { isUnique: false, field: 'empId', message: 'Employee ID is already registered in members.' };
      }
      if (cleanMem && ((m.id && m.id.toUpperCase() === cleanMem) || (m.membership_id && m.membership_id.toUpperCase() === cleanMem))) {
        return { isUnique: false, field: 'membershipId', message: 'Membership ID is already assigned in members.' };
      }
    }

    return { isUnique: true };
  }
}

// Singleton database instance
export const db = new Database();
