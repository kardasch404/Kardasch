import User, { Role } from '../models/User.js';
import Database from '../services/database.js';

const seedAdmin = async () => {
    const db = Database.getInstance();
    await db.connect();
    
    const existing = await User.findOne({ email: 'kardachezakaria45@gmail.com' });
    
    if (!existing) {
        await User.create({
            firstName: 'Zakaria',
            lastName: 'Kardache',
            email: 'kardachezakaria45@gmail.com',
            password: 'kardachezakaria45',
            role: Role.ADMIN
        });
        console.log('✅ Admin user created successfully');
    } else {
        console.log('✅ Admin user already exists');
    }
    
    await db.disconnect();
    process.exit(0);
};

seedAdmin().catch(error => {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
});
