import { Model } from 'sequelize';
declare class User extends Model {
    id: number;
    google_id: string | null;
    email: string;
}
export default User;
//# sourceMappingURL=user.d.ts.map