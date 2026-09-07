-- ============================================================================
-- get_dashboard_stats()
-- ----------------------------------------------------------------------------
-- Hàm thống kê dashboard cho trang admin.
-- - SECURITY DEFINER: chạy với quyền của người tạo hàm (postgres/superadmin),
--   bypass RLS hạn chế của bảng `players` ("Read own player on login").
-- - Trả về 1 JSON → chỉ cần 1 request, tránh lỗi 400 + ~20 request của client.
--
-- LƯU Ý CỘT NGÀY (nguồn lỗi 400):
--   * players    có date = registration_date (KHÔNG có created_at)
--   * alliances  có date = created_date
--   * battles    có date = created_at
--
-- Doanh thu (totalRevenue / revenueToday / ... / revenueByType) KHÔNG có bảng
-- lưu trong CSDL, nên hàm này trả revenue = 0 và sẽ được merge dữ liệu "fake"
-- ở phía client (xem hooks/useDashboardStats.ts).
--
-- Tạo hàm (chạy trong Supabase SQL editor / migration):
--
--   drop function if exists public.get_dashboard_stats();
--   create function public.get_dashboard_stats() returns json ...;
--   grant execute on function public.get_dashboard_stats() to anon, authenticated;
-- ============================================================================

create or replace function public.get_dashboard_stats()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_total_players          bigint;
  v_new_players_today      bigint;
  v_new_players_this_week  bigint;
  v_active_players_today   bigint;
  v_active_players_this_week bigint;

  v_total_alliances        bigint;
  v_new_alliances_today    bigint;
  v_total_alliance_members bigint;
  v_avg_alliance_size      numeric;

  v_total_battles          bigint;
  v_battles_today          bigint;
  v_battles_this_week      bigint;
  v_completed_battles      bigint;

  v_daily jsonb;
  v_weekly jsonb;

  r jsonb;
begin
  -- ============================ PLAYERS ============================
  -- Lưu ý: cột ngày của bảng players là registration_date.
  select count(*) into v_total_players          from public.players;
  select count(*) into v_new_players_today      from public.players
    where registration_date >= date_trunc('day', now());
  select count(*) into v_new_players_this_week  from public.players
    where registration_date >= date_trunc('day', now()) - interval '7 days';

  -- Active players = số player_id phân biệt có trong battles theo kỳ.
  select count(distinct pid) into v_active_players_today
  from (
    select player1_id as pid from public.battles
      where created_at >= date_trunc('day', now())
    union
    select player2_id from public.battles
      where created_at >= date_trunc('day', now())
  ) t where pid is not null;

  select count(distinct pid) into v_active_players_this_week
  from (
    select player1_id as pid from public.battles
      where created_at >= (date_trunc('day', now()) - interval '7 days')
    union
    select player2_id from public.battles
      where created_at >= (date_trunc('day', now()) - interval '7 days')
  ) t where pid is not null;

  -- ============================ ALLIANCES ============================
  select count(*) into v_total_alliances from public.alliances;
  select count(*) into v_new_alliances_today from public.alliances
    where created_date >= date_trunc('day', now());
  select count(*) into v_total_alliance_members from public.alliance_members;

  select case
           when v_total_alliance_members = 0
                or count(distinct alliance_id) = 0
           then 0
           else round(v_total_alliance_members::numeric / count(distinct alliance_id), 0)
         end
  into v_avg_alliance_size
  from public.alliance_members;

  -- ============================ BATTLES ============================
  select count(*) into v_total_battles    from public.battles;
  select count(*) into v_battles_today    from public.battles
    where created_at >= date_trunc('day', now());
  select count(*) into v_battles_this_week from public.battles
    where created_at >= (date_trunc('day', now()) - interval '7 days');
  select count(*) into v_completed_battles from public.battles
    where status = 'completed';

  -- ============================ DAILY STATS (30 ngày) ============================
  select coalesce(jsonb_agg(j), '[]'::jsonb)
  into v_daily
  from (
    select jsonb_build_object(
             'date',    to_char(d.day, 'YYYY-MM-DD'),
             'players', (select count(*) from public.players
                          where registration_date >= d.day
                            and registration_date <  d.day + interval '1 day'),
             'battles', (select count(*) from public.battles
                          where created_at >= d.day
                            and created_at <  d.day + interval '1 day'),
             'revenue', 0
           ) as j
    from generate_series(
           (date_trunc('day', now())::date - 29)::timestamptz,
           date_trunc('day', now())::timestamptz,
           interval '1 day'
         ) as d(day)
  ) t;

  -- ============================ WEEKLY STATS (4 tuần) ============================
  select coalesce(jsonb_agg(j), '[]'::jsonb)
  into v_weekly
  from (
    select jsonb_build_object(
             'week', 'Tuan ' || (4 - w.offset_week),
             'players', (select count(*) from public.players
                          where registration_date >= w.start_d
                            and registration_date <  w.start_d + interval '7 days'),
             'battles', (select count(*) from public.battles
                          where created_at >= w.start_d
                            and created_at <  w.start_d + interval '7 days'),
             'revenue', 0
           ) as j
    from (
      select
        offs as offset_week,
        (date_trunc('day', now()) - (offs * 7 + 7) * interval '1 day') as start_d
      from generate_series(0, 3) as offs(offs)
    ) w
  ) t;

  -- ============================ ASSEMBLE ============================
  r := jsonb_build_object(
    'totalPlayers',           v_total_players,
    'newPlayersToday',        v_new_players_today,
    'newPlayersThisWeek',     v_new_players_this_week,
    'activePlayersToday',     v_active_players_today,
    'activePlayersThisWeek',  v_active_players_this_week,

    'totalAlliances',         v_total_alliances,
    'newAlliancesToday',      v_new_alliances_today,
    'totalAllianceMembers',   v_total_alliance_members,
    'avgAllianceSize',        v_avg_alliance_size,

    'totalBattles',           v_total_battles,
    'battlesToday',           v_battles_today,
    'battlesThisWeek',        v_battles_this_week,
    'battleCompletionRate',   case when v_total_battles = 0 then 0
                                   else ceil(v_completed_battles::numeric / v_total_battles * 100)::int end,
    'battlesByStatus',        coalesce((
      select jsonb_agg(jsonb_build_object('status', status, 'count', cnt))
      from (select status, count(*) as cnt from public.battles group by status) s
    ), '[]'::jsonb),

    'dailyStats',             v_daily,
    'weeklyStats',            v_weekly
  );

  return r::json;
end;
$$;

-- Cấp quyền gọi cho role anon + authenticated (admin đăng nhập bằng anon key).
revoke all on function public.get_dashboard_stats() from public;
grant execute on function public.get_dashboard_stats() to anon, authenticated;
