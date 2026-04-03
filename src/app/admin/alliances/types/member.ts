// ✅ Define type chuẩn (player là object, không phải array)
export interface Member {
  role: string;
  joined_at: string;

  player: {
    id: string;
    username: string;
    level: number;
    power: number;
  } | null | any;
}


