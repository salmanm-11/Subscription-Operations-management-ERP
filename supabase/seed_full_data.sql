-- ==============================================================================-- KARAMA MESS MANAGEMENT - FULL SEED DATA-- Includes 310 Buildings, 436 Customers, 87 Overdue Invoices, and 365 Ledger Days-- Currency: AED-- ==============================================================================
BEGIN;
-- 1. BUILDINGSINSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-1', 'b0000000-0000-0000-0000-000000000001', 'Era Building', '🟠 Burjman & Mankhool', 'Era Building, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-2', 'b0000000-0000-0000-0000-000000000001', 'Oroville Building Mankhool', '🟠 Burjman & Mankhool', 'Oroville Building Mankhool, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-3', 'b0000000-0000-0000-0000-000000000001', 'Oriental house-1,1st floor,', '🟠 Burjman & Mankhool', 'Oriental house-1,1st floor,, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-4', 'b0000000-0000-0000-0000-000000000001', 'RAK Bank', '🟠 Burjman & Mankhool', 'RAK Bank, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-5', 'b0000000-0000-0000-0000-000000000001', 'Falaknaz', '🟠 Burjman & Mankhool', 'Falaknaz, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-6', 'b0000000-0000-0000-0000-000000000001', 'Deema', '🟠 Burjman & Mankhool', 'Deema, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-7', 'b0000000-0000-0000-0000-000000000001', 'Park Residency', '🟠 Burjman & Mankhool', 'Park Residency, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-8', 'b0000000-0000-0000-0000-000000000001', 'Orville Building [ Teams Restaurant]', '🟠 Burjman & Mankhool', 'Orville Building [ Teams Restaurant], 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-9', 'b0000000-0000-0000-0000-000000000001', 'Al Kasim Building', '🟠 Burjman & Mankhool', 'Al Kasim Building, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-10', 'b0000000-0000-0000-0000-000000000001', 'Al Bafta', '🟠 Burjman & Mankhool', 'Al Bafta, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-11', 'b0000000-0000-0000-0000-000000000001', 'White Sand Building, Mankhool', '🟠 Burjman & Mankhool', 'White Sand Building, Mankhool, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-12', 'b0000000-0000-0000-0000-000000000001', 'White sand, Mankhool', '🟠 Burjman & Mankhool', 'White sand, Mankhool, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-13', 'b0000000-0000-0000-0000-000000000001', 'Burjman exit 1 Marjan building', '🟠 Burjman & Mankhool', 'Burjman exit 1 Marjan building, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-14', 'b0000000-0000-0000-0000-000000000001', 'Burjman exit 4 Betterliving Apartment', '🟠 Burjman & Mankhool', 'Burjman exit 4 Betterliving Apartment, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-15', 'b0000000-0000-0000-0000-000000000001', 'Better living apartments', '🟠 Burjman & Mankhool', 'Better living apartments, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-16', 'b0000000-0000-0000-0000-000000000001', 'Al hamriya building no 53 Block c', '🟠 Burjman & Mankhool', 'Al hamriya building no 53 Block c, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-17', 'b0000000-0000-0000-0000-000000000001', 'Al reha building Mankhool', '🟠 Burjman & Mankhool', 'Al reha building Mankhool, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-18', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl U', '🟡 Park, Pioneer & ADCB', 'Al Wasl U, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-19', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl R -381 Block', '🟡 Park, Pioneer & ADCB', 'Al Wasl R -381 Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-20', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl F', '🟡 Park, Pioneer & ADCB', 'Al Wasl F, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-21', 'b0000000-0000-0000-0000-000000000001', 'Al wasl R block', '🟡 Park, Pioneer & ADCB', 'Al wasl R block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-22', 'b0000000-0000-0000-0000-000000000001', 'Aaramam Restaurant Building', '🟡 Park, Pioneer & ADCB', 'Aaramam Restaurant Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-23', 'b0000000-0000-0000-0000-000000000001', 'L- Block Al Wasl', '🟡 Park, Pioneer & ADCB', 'L- Block Al Wasl, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-24', 'b0000000-0000-0000-0000-000000000001', 'A9 Building', '🟡 Park, Pioneer & ADCB', 'A9 Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-25', 'b0000000-0000-0000-0000-000000000001', 'City Tower', '🟡 Park, Pioneer & ADCB', 'City Tower, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-26', 'b0000000-0000-0000-0000-000000000001', 'baskin robinslal,B Block', '🟡 Park, Pioneer & ADCB', 'baskin robinslal,B Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-27', 'b0000000-0000-0000-0000-000000000001', 'Vijazla', '🟡 Park, Pioneer & ADCB', 'Vijazla, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-28', 'b0000000-0000-0000-0000-000000000001', 'Ali Gas Building', '🟡 Park, Pioneer & ADCB', 'Ali Gas Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-29', 'b0000000-0000-0000-0000-000000000001', 'Ali Gas - Block A', '🟡 Park, Pioneer & ADCB', 'Ali Gas - Block A, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-30', 'b0000000-0000-0000-0000-000000000001', 'Building 44', '🟡 Park, Pioneer & ADCB', 'Building 44, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-31', 'b0000000-0000-0000-0000-000000000001', 'Building 504, Behind Sangeetha Restaurant', '🟡 Park, Pioneer & ADCB', 'Building 504, Behind Sangeetha Restaurant, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-32', 'b0000000-0000-0000-0000-000000000001', 'Al wasl - L Block, 
2nd floor', '🟡 Park, Pioneer & ADCB', 'Al wasl - L Block, 
2nd floor, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-33', 'b0000000-0000-0000-0000-000000000001', 'LuLu Center Building', '🟡 Park, Pioneer & ADCB', 'LuLu Center Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-34', 'b0000000-0000-0000-0000-000000000001', 'Old Ladies Building -90', '🟡 Park, Pioneer & ADCB', 'Old Ladies Building -90, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-35', 'b0000000-0000-0000-0000-000000000001', 'Nayarangganj Gents Ssloon Building', '🟡 Park, Pioneer & ADCB', 'Nayarangganj Gents Ssloon Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-36', 'b0000000-0000-0000-0000-000000000001', 'Lulu centre building', '🟡 Park, Pioneer & ADCB', 'Lulu centre building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-37', 'b0000000-0000-0000-0000-000000000001', 'Al wasl L block', '🟡 Park, Pioneer & ADCB', 'Al wasl L block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-38', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl J Block', '🟡 Park, Pioneer & ADCB', 'Al Wasl J Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-39', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl K Block', '🟡 Park, Pioneer & ADCB', 'Al Wasl K Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-40', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl HBlock', '🟡 Park, Pioneer & ADCB', 'Al Wasl HBlock, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-41', 'b0000000-0000-0000-0000-000000000001', 'Kottakkal Building', '🟡 Park, Pioneer & ADCB', 'Kottakkal Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-42', 'b0000000-0000-0000-0000-000000000001', 'Kottakkal', '🟡 Park, Pioneer & ADCB', 'Kottakkal, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-43', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl B Block', '🟡 Park, Pioneer & ADCB', 'Al Wasl B Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-44', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl C Block', '🟡 Park, Pioneer & ADCB', 'Al Wasl C Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-45', 'b0000000-0000-0000-0000-000000000001', 'Winneys', '🟡 Park, Pioneer & ADCB', 'Winneys, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-46', 'b0000000-0000-0000-0000-000000000001', 'Baskin Robins building', '🟡 Park, Pioneer & ADCB', 'Baskin Robins building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-47', 'b0000000-0000-0000-0000-000000000001', 'Kottakkal building C Block', '🟡 Park, Pioneer & ADCB', 'Kottakkal building C Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-48', 'b0000000-0000-0000-0000-000000000001', 'Emirates building 362', '🟡 Park, Pioneer & ADCB', 'Emirates building 362, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-49', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl G block (Opposite to green gate restaurant)', '🟡 Park, Pioneer & ADCB', 'Al Wasl G block (Opposite to green gate restaurant), 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-50', 'b0000000-0000-0000-0000-000000000001', 'Karama gold building', '🟡 Park, Pioneer & ADCB', 'Karama gold building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-51', 'b0000000-0000-0000-0000-000000000001', 'Chittilapilly Building 504', '🟡 Park, Pioneer & ADCB', 'Chittilapilly Building 504, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-52', 'b0000000-0000-0000-0000-000000000001', 'Lulu Electronics Building,', '🟡 Park, Pioneer & ADCB', 'Lulu Electronics Building,, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-53', 'b0000000-0000-0000-0000-000000000001', 'Star of karama building', '🟡 Park, Pioneer & ADCB', 'Star of karama building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-54', 'b0000000-0000-0000-0000-000000000001', 'Modern pharmacy building', '🟡 Park, Pioneer & ADCB', 'Modern pharmacy building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-55', 'b0000000-0000-0000-0000-000000000001', 'Garage Building', '🟡 Park, Pioneer & ADCB', 'Garage Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-56', 'b0000000-0000-0000-0000-000000000001', 'Al Amani Building', '🟢 Karama Center - Pyramid', 'Al Amani Building, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-57', 'b0000000-0000-0000-0000-000000000001', 'China garden', '🟢 Karama Center - Pyramid', 'China garden, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-58', 'b0000000-0000-0000-0000-000000000001', 'Souksagar', '🟢 Karama Center - Pyramid', 'Souksagar, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-59', 'b0000000-0000-0000-0000-000000000001', 'Star building B block', '🟢 Karama Center - Pyramid', 'Star building B block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-60', 'b0000000-0000-0000-0000-000000000001', 'Bin haider 1', '🟢 Karama Center - Pyramid', 'Bin haider 1, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-61', 'b0000000-0000-0000-0000-000000000001', 'Star One B Block', '🟢 Karama Center - Pyramid', 'Star One B Block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-62', 'b0000000-0000-0000-0000-000000000001', 'Star A', '🟢 Karama Center - Pyramid', 'Star A, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-63', 'b0000000-0000-0000-0000-000000000001', 'Old China Garden', '🟢 Karama Center - Pyramid', 'Old China Garden, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-64', 'b0000000-0000-0000-0000-000000000001', 'Bin haider 2', '🟢 Karama Center - Pyramid', 'Bin haider 2, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-65', 'b0000000-0000-0000-0000-000000000001', 'Star -1-B -Block', '🟢 Karama Center - Pyramid', 'Star -1-B -Block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-66', 'b0000000-0000-0000-0000-000000000001', 'Al Amani', '🟢 Karama Center - Pyramid', 'Al Amani, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-67', 'b0000000-0000-0000-0000-000000000001', 'B - Block', '🟢 Karama Center - Pyramid', 'B - Block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-68', 'b0000000-0000-0000-0000-000000000001', 'Mamukkas', '🟢 Karama Center - Pyramid', 'Mamukkas, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-69', 'b0000000-0000-0000-0000-000000000001', 'Al Amaani', '🟢 Karama Center - Pyramid', 'Al Amaani, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-70', 'b0000000-0000-0000-0000-000000000001', 'Star 1 - B block', '🟢 Karama Center - Pyramid', 'Star 1 - B block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-71', 'b0000000-0000-0000-0000-000000000001', 'Star 1', '🟢 Karama Center - Pyramid', 'Star 1, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-72', 'b0000000-0000-0000-0000-000000000001', 'Life Pharmacy (Near Curry Chutty Building)', '🟢 Karama Center - Pyramid', 'Life Pharmacy (Near Curry Chutty Building), 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-73', 'b0000000-0000-0000-0000-000000000001', 'Star 1 - A block', '🟢 Karama Center - Pyramid', 'Star 1 - A block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-74', 'b0000000-0000-0000-0000-000000000001', 'Aaya kada paya restaurant (Old China garden)', '🟢 Karama Center - Pyramid', 'Aaya kada paya restaurant (Old China garden), 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-75', 'b0000000-0000-0000-0000-000000000001', 'May Flower Building lucky flower', '🟢 Karama Center - Pyramid', 'May Flower Building lucky flower, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-76', 'b0000000-0000-0000-0000-000000000001', 'Al Attar Shopping Mall', '🟢 Karama Center - Pyramid', 'Al Attar Shopping Mall, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-77', 'b0000000-0000-0000-0000-000000000001', 'Fathima Building', '🟢 Karama Center - Pyramid', 'Fathima Building, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-78', 'b0000000-0000-0000-0000-000000000001', 'Souk Sagar', '🟢 Karama Center - Pyramid', 'Souk Sagar, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-79', 'b0000000-0000-0000-0000-000000000001', 'Emerald Building B Block', '🟢 Karama Center - Pyramid', 'Emerald Building B Block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-80', 'b0000000-0000-0000-0000-000000000001', 'Karama Center', '🟢 Karama Center - Pyramid', 'Karama Center, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-81', 'b0000000-0000-0000-0000-000000000001', 'Ustad Grills Flat 55', '🟣 Hamdan Colony & Post', 'Ustad Grills Flat 55, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-82', 'b0000000-0000-0000-0000-000000000001', 'Viva building', '🟣 Hamdan Colony & Post', 'Viva building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-83', 'b0000000-0000-0000-0000-000000000001', 'Famous cafeteria building', '🟣 Hamdan Colony & Post', 'Famous cafeteria building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-84', 'b0000000-0000-0000-0000-000000000001', 'G 3 Building', '🟣 Hamdan Colony & Post', 'G 3 Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-85', 'b0000000-0000-0000-0000-000000000001', 'G3', '🟣 Hamdan Colony & Post', 'G3, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-86', 'b0000000-0000-0000-0000-000000000001', 'B 4 Building', '🟣 Hamdan Colony & Post', 'B 4 Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-87', 'b0000000-0000-0000-0000-000000000001', 'G 2 Building', '🟣 Hamdan Colony & Post', 'G 2 Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-88', 'b0000000-0000-0000-0000-000000000001', 'G 6 Building', '🟣 Hamdan Colony & Post', 'G 6 Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-89', 'b0000000-0000-0000-0000-000000000001', 'Building 69', '🟣 Hamdan Colony & Post', 'Building 69, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-90', 'b0000000-0000-0000-0000-000000000001', 'Akbar Travels Building', '🟣 Hamdan Colony & Post', 'Akbar Travels Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-91', 'b0000000-0000-0000-0000-000000000001', 'Y4 building', '🟣 Hamdan Colony & Post', 'Y4 building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-92', 'b0000000-0000-0000-0000-000000000001', 'Rashed mill', '🟣 Hamdan Colony & Post', 'Rashed mill, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-93', 'b0000000-0000-0000-0000-000000000001', 'R9', '🟣 Hamdan Colony & Post', 'R9, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-94', 'b0000000-0000-0000-0000-000000000001', 'R4', '🟣 Hamdan Colony & Post', 'R4, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-95', 'b0000000-0000-0000-0000-000000000001', 'B6', '🟣 Hamdan Colony & Post', 'B6, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-96', 'b0000000-0000-0000-0000-000000000001', 'Y 10 Building', '🟣 Hamdan Colony & Post', 'Y 10 Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-97', 'b0000000-0000-0000-0000-000000000001', 'Rashid Mill', '🟣 Hamdan Colony & Post', 'Rashid Mill, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-98', 'b0000000-0000-0000-0000-000000000001', 'Khaleefa Building 48/50', '🟣 Hamdan Colony & Post', 'Khaleefa Building 48/50, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-99', 'b0000000-0000-0000-0000-000000000001', 'Old is gold building', '🟣 Hamdan Colony & Post', 'Old is gold building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-100', 'b0000000-0000-0000-0000-000000000001', 'Khalifa building 48/50', '🟣 Hamdan Colony & Post', 'Khalifa building 48/50, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-101', 'b0000000-0000-0000-0000-000000000001', 'Khalifa 3 - Block ab', '🟣 Hamdan Colony & Post', 'Khalifa 3 - Block ab, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-102', 'b0000000-0000-0000-0000-000000000001', 'Crowd Restaurant Building', '🟣 Hamdan Colony & Post', 'Crowd Restaurant Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-103', 'b0000000-0000-0000-0000-000000000001', 'Al Hamra Building', '🟣 Hamdan Colony & Post', 'Al Hamra Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-104', 'b0000000-0000-0000-0000-000000000001', 'Adnan building, Ground Floor', '🟣 Hamdan Colony & Post', 'Adnan building, Ground Floor, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-105', 'b0000000-0000-0000-0000-000000000001', 'Karama Building - 4 Dhe fish restaurant', '🟣 Hamdan Colony & Post', 'Karama Building - 4 Dhe fish restaurant, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-106', 'b0000000-0000-0000-0000-000000000001', 'Yousef tower', '🟣 Hamdan Colony & Post', 'Yousef tower, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-107', 'b0000000-0000-0000-0000-000000000001', 'Brahmi', '🟣 Hamdan Colony & Post', 'Brahmi, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-108', 'b0000000-0000-0000-0000-000000000001', 'Mallu cafe building', '🟣 Hamdan Colony & Post', 'Mallu cafe building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-109', 'b0000000-0000-0000-0000-000000000001', 'Khaleefa building', '🟣 Hamdan Colony & Post', 'Khaleefa building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-110', 'b0000000-0000-0000-0000-000000000001', 'Karama live', '🟣 Hamdan Colony & Post', 'Karama live, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-111', 'b0000000-0000-0000-0000-000000000001', 'G6', '🟣 Hamdan Colony & Post', 'G6, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-112', 'b0000000-0000-0000-0000-000000000001', 'Ayhaco Building', '🟣 Hamdan Colony & Post', 'Ayhaco Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-113', 'b0000000-0000-0000-0000-000000000001', 'Karama General', 'Karama Central', 'Karama General, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-114', 'b0000000-0000-0000-0000-000000000001', 'G Block Al Wasl', 'Karama Central', 'G Block Al Wasl, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-115', 'b0000000-0000-0000-0000-000000000001', 'Rashid Mill', 'Karama Central', 'Rashid Mill, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-116', 'b0000000-0000-0000-0000-000000000001', 'Ali gas building - B block', 'Karama Central', 'Ali gas building - B block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-117', 'b0000000-0000-0000-0000-000000000001', 'Al Hilal - A block', 'Karama Central', 'Al Hilal - A block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-118', 'b0000000-0000-0000-0000-000000000001', 'Zam Zam Mandi Building -C Block-12', 'Karama Central', 'Zam Zam Mandi Building -C Block-12, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-119', 'b0000000-0000-0000-0000-000000000001', 'Pioneer Building 48', '🟡 Park, Pioneer & ADCB', 'Pioneer Building 48, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-120', 'b0000000-0000-0000-0000-000000000001', 'Vijazala Building,Emirates 362', 'Karama Central', 'Vijazala Building,Emirates 362, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-121', 'b0000000-0000-0000-0000-000000000001', 'Ummu hurair residence 2', 'Karama Central', 'Ummu hurair residence 2, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-122', 'b0000000-0000-0000-0000-000000000001', 'Al Mansoori', 'Karama Central', 'Al Mansoori, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-123', 'b0000000-0000-0000-0000-000000000001', 'Sunrise', 'Karama Central', 'Sunrise, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-124', 'b0000000-0000-0000-0000-000000000001', 'Emerald Resturant Building', 'Karama Central', 'Emerald Resturant Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-125', 'b0000000-0000-0000-0000-000000000001', 'Al Hamrah', 'Karama Central', 'Al Hamrah, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-126', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl R445', 'Karama Central', 'Al Wasl R445, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-127', 'b0000000-0000-0000-0000-000000000001', 'Al Khaleej', 'Karama Central', 'Al Khaleej, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-128', 'b0000000-0000-0000-0000-000000000001', 'L Block Al Wasl', 'Karama Central', 'L Block Al Wasl, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-129', 'b0000000-0000-0000-0000-000000000001', 'Al Hilal', 'Karama Central', 'Al Hilal, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-130', 'b0000000-0000-0000-0000-000000000001', 'Bin Haider 1', 'Karama Central', 'Bin Haider 1, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-131', 'b0000000-0000-0000-0000-000000000001', 'Y 10 Building', 'Karama Central', 'Y 10 Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-132', 'b0000000-0000-0000-0000-000000000001', 'Era Building', 'Karama Central', 'Era Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-133', 'b0000000-0000-0000-0000-000000000001', 'Khulfi House', 'Karama Central', 'Khulfi House, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-134', 'b0000000-0000-0000-0000-000000000001', 'Shaikh Mariyam', 'Karama Central', 'Shaikh Mariyam, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-135', 'b0000000-0000-0000-0000-000000000001', 'Karama 1 building
Karak Zone Cafeteria Backside', 'Karama Central', 'Karama 1 building
Karak Zone Cafeteria Backside, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-136', 'b0000000-0000-0000-0000-000000000001', 'Arenco Building', 'Karama Central', 'Arenco Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-137', 'b0000000-0000-0000-0000-000000000001', 'Super Kid restaurant', 'Karama Central', 'Super Kid restaurant, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-138', 'b0000000-0000-0000-0000-000000000001', 'Y 8Building', 'Karama Central', 'Y 8Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-139', 'b0000000-0000-0000-0000-000000000001', 'Magic Fork', 'Karama Central', 'Magic Fork, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-140', 'b0000000-0000-0000-0000-000000000001', 'G 2 Building', 'Karama Central', 'G 2 Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-141', 'b0000000-0000-0000-0000-000000000001', 'Al Dubaiba', 'Karama Central', 'Al Dubaiba, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-142', 'b0000000-0000-0000-0000-000000000001', 'Al Blouki', 'Karama Central', 'Al Blouki, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-143', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl D Block', 'Karama Central', 'Al Wasl D Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-144', 'b0000000-0000-0000-0000-000000000001', 'Star 1 B Block', 'Karama Central', 'Star 1 B Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-145', 'b0000000-0000-0000-0000-000000000001', 'Rawdat Al Karama', 'Karama Central', 'Rawdat Al Karama, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-146', 'b0000000-0000-0000-0000-000000000001', 'Emirates Building - 48-50', 'Karama Central', 'Emirates Building - 48-50, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-147', 'b0000000-0000-0000-0000-000000000001', 'Mubarak Building', 'Karama Central', 'Mubarak Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-148', 'b0000000-0000-0000-0000-000000000001', 'Ahaliya Exchange Building', 'Karama Central', 'Ahaliya Exchange Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-149', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl N Block', 'Karama Central', 'Al Wasl N Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-150', 'b0000000-0000-0000-0000-000000000001', 'Bin Hyder 3', 'Karama Central', 'Bin Hyder 3, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-151', 'b0000000-0000-0000-0000-000000000001', 'Al wasl H block', 'Karama Central', 'Al wasl H block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-152', 'b0000000-0000-0000-0000-000000000001', 'Pyramid Building -A Block', '🟢 Karama Center - Pyramid', 'Pyramid Building -A Block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-153', 'b0000000-0000-0000-0000-000000000001', 'Pioneer 43', '🟡 Park, Pioneer & ADCB', 'Pioneer 43, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-154', 'b0000000-0000-0000-0000-000000000001', 'Al Attar Center', '🟢 Karama Center - Pyramid', 'Al Attar Center, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-155', 'b0000000-0000-0000-0000-000000000001', 'Juma Majid 3', 'Karama Central', 'Juma Majid 3, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-156', 'b0000000-0000-0000-0000-000000000001', 'Bel Rashid Building', 'Karama Central', 'Bel Rashid Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-157', 'b0000000-0000-0000-0000-000000000001', 'Sheikh Mariyam & Atlas Building', 'Karama Central', 'Sheikh Mariyam & Atlas Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-158', 'b0000000-0000-0000-0000-000000000001', 'Sunrise Building', 'Karama Central', 'Sunrise Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-159', 'b0000000-0000-0000-0000-000000000001', 'M Square Building', 'Karama Central', 'M Square Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-160', 'b0000000-0000-0000-0000-000000000001', 'Bloom Apartment', 'Karama Central', 'Bloom Apartment, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-161', 'b0000000-0000-0000-0000-000000000001', 'G 3 Building', 'Karama Central', 'G 3 Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-162', 'b0000000-0000-0000-0000-000000000001', 'Souk Sagar', 'Karama Central', 'Souk Sagar, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-163', 'b0000000-0000-0000-0000-000000000001', 'Lassi Home', 'Karama Central', 'Lassi Home, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-164', 'b0000000-0000-0000-0000-000000000001', 'Lassi home (Shop)', 'Karama Central', 'Lassi home (Shop), Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-165', 'b0000000-0000-0000-0000-000000000001', 'Park Residency', '🟡 Park, Pioneer & ADCB', 'Park Residency, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-166', 'b0000000-0000-0000-0000-000000000001', 'Star of Karama
A block', 'Karama Central', 'Star of Karama
A block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-167', 'b0000000-0000-0000-0000-000000000001', 'SBK Residence ,Burjuman Exit 3', 'Karama Central', 'SBK Residence ,Burjuman Exit 3, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-168', 'b0000000-0000-0000-0000-000000000001', 'Emarald', 'Karama Central', 'Emarald, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-169', 'b0000000-0000-0000-0000-000000000001', 'Sunset', 'Karama Central', 'Sunset, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-170', 'b0000000-0000-0000-0000-000000000001', 'Bin Hyder', 'Karama Central', 'Bin Hyder, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-171', 'b0000000-0000-0000-0000-000000000001', 'Al Khaja Building', 'Karama Central', 'Al Khaja Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-172', 'b0000000-0000-0000-0000-000000000001', 'Star 1 - B block', 'Karama Central', 'Star 1 - B block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-173', 'b0000000-0000-0000-0000-000000000001', 'G block Al Wasl building', 'Karama Central', 'G block Al Wasl building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-174', 'b0000000-0000-0000-0000-000000000001', 'Chorukada Building', 'Karama Central', 'Chorukada Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-175', 'b0000000-0000-0000-0000-000000000001', 'Emirates Building -48-50', 'Karama Central', 'Emirates Building -48-50, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-176', 'b0000000-0000-0000-0000-000000000001', 'Altaar - A Block', 'Karama Central', 'Altaar - A Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-177', 'b0000000-0000-0000-0000-000000000001', 'May Flower', 'Karama Central', 'May Flower, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-178', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl R Block', 'Karama Central', 'Al Wasl R Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-179', 'b0000000-0000-0000-0000-000000000001', 'Shaikha Mariyam', 'Karama Central', 'Shaikha Mariyam, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-180', 'b0000000-0000-0000-0000-000000000001', 'Building No 33', 'Karama Central', 'Building No 33, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-181', 'b0000000-0000-0000-0000-000000000001', 'Building No 44,', 'Karama Central', 'Building No 44,, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-182', 'b0000000-0000-0000-0000-000000000001', 'Ahalya', 'Karama Central', 'Ahalya, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-183', 'b0000000-0000-0000-0000-000000000001', 'Al Wasal K Block,5265#', 'Karama Central', 'Al Wasal K Block,5265#, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-184', 'b0000000-0000-0000-0000-000000000001', 'R 2 Building', 'Karama Central', 'R 2 Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-185', 'b0000000-0000-0000-0000-000000000001', 'Sopanam Restaurant Building', 'Karama Central', 'Sopanam Restaurant Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-186', 'b0000000-0000-0000-0000-000000000001', 'Star 1 A Block', 'Karama Central', 'Star 1 A Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-187', 'b0000000-0000-0000-0000-000000000001', 'Biuilding 61', 'Karama Central', 'Biuilding 61, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-188', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl -H Block', 'Karama Central', 'Al Wasl -H Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-189', 'b0000000-0000-0000-0000-000000000001', 'Building No 61', 'Karama Central', 'Building No 61, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-190', 'b0000000-0000-0000-0000-000000000001', 'Al Kasim', 'Karama Central', 'Al Kasim, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-191', 'b0000000-0000-0000-0000-000000000001', 'Karama Gold', 'Karama Central', 'Karama Gold, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-192', 'b0000000-0000-0000-0000-000000000001', 'AL WASL G Block', 'Karama Central', 'AL WASL G Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-193', 'b0000000-0000-0000-0000-000000000001', '44 BUILDING', 'Karama Central', '44 BUILDING, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-194', 'b0000000-0000-0000-0000-000000000001', 'Al wasl - H Block', 'Karama Central', 'Al wasl - H Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-195', 'b0000000-0000-0000-0000-000000000001', 'G 6 Building', 'Karama Central', 'G 6 Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-196', 'b0000000-0000-0000-0000-000000000001', 'Al Wasal A Block', 'Karama Central', 'Al Wasal A Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-197', 'b0000000-0000-0000-0000-000000000001', 'Hamriya 43', 'Karama Central', 'Hamriya 43, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-198', 'b0000000-0000-0000-0000-000000000001', 'Bin Hyder 1', 'Karama Central', 'Bin Hyder 1, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-199', 'b0000000-0000-0000-0000-000000000001', 'Star of karama -B -Block', 'Karama Central', 'Star of karama -B -Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-200', 'b0000000-0000-0000-0000-000000000001', 'PIONEER BUILDING  8', 'Karama Central', 'PIONEER BUILDING  8, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-201', 'b0000000-0000-0000-0000-000000000001', 'Y 8', 'Karama Central', 'Y 8, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-202', 'b0000000-0000-0000-0000-000000000001', 'Star of Karama  B Block', 'Karama Central', 'Star of Karama  B Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-203', 'b0000000-0000-0000-0000-000000000001', 'R4', 'Karama Central', 'R4, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-204', 'b0000000-0000-0000-0000-000000000001', 'Kottakkal , A Block', 'Karama Central', 'Kottakkal , A Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-205', 'b0000000-0000-0000-0000-000000000001', 'R Block Al Wasl', 'Karama Central', 'R Block Al Wasl, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-206', 'b0000000-0000-0000-0000-000000000001', 'S.M.J 3 building Near Greenland', 'Karama Central', 'S.M.J 3 building Near Greenland, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-207', 'b0000000-0000-0000-0000-000000000001', 'Al Wasal J Block,5160#', 'Karama Central', 'Al Wasal J Block,5160#, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-208', 'b0000000-0000-0000-0000-000000000001', 'Al Hilal Building', 'Karama Central', 'Al Hilal Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-209', 'b0000000-0000-0000-0000-000000000001', 'Building 59', 'Karama Central', 'Building 59, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-210', 'b0000000-0000-0000-0000-000000000001', 'Al bafta plaza', 'Karama Central', 'Al bafta plaza, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-211', 'b0000000-0000-0000-0000-000000000001', 'Westzone Building', 'Karama Central', 'Westzone Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-212', 'b0000000-0000-0000-0000-000000000001', 'Building number - A9 (standview restaurant),   Second floor', 'Karama Central', 'Building number - A9 (standview restaurant),   Second floor, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-213', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl - Building No.R381', 'Karama Central', 'Al Wasl - Building No.R381, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-214', 'b0000000-0000-0000-0000-000000000001', 'Hookah building', 'Karama Central', 'Hookah building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-215', 'b0000000-0000-0000-0000-000000000001', 'Bu Ameen 1', 'Karama Central', 'Bu Ameen 1, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-216', 'b0000000-0000-0000-0000-000000000001', 'Moongate Building', 'Karama Central', 'Moongate Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-217', 'b0000000-0000-0000-0000-000000000001', 'Sunset Building', 'Karama Central', 'Sunset Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-218', 'b0000000-0000-0000-0000-000000000001', 'Lulu Center', '🟢 Karama Center - Pyramid', 'Lulu Center, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-219', 'b0000000-0000-0000-0000-000000000001', 'Crowd Restaurant Building', 'Karama Central', 'Crowd Restaurant Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-220', 'b0000000-0000-0000-0000-000000000001', 'A3 building , 1st floor', 'Karama Central', 'A3 building , 1st floor, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-221', 'b0000000-0000-0000-0000-000000000001', 'Ss Lootha Building', 'Karama Central', 'Ss Lootha Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-222', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl, D Block', 'Karama Central', 'Al Wasl, D Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-223', 'b0000000-0000-0000-0000-000000000001', 'B 6 Building', 'Karama Central', 'B 6 Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-224', 'b0000000-0000-0000-0000-000000000001', 'Al Dubaiba Building', 'Karama Central', 'Al Dubaiba Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-225', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl L Block', 'Karama Central', 'Al Wasl L Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-226', 'b0000000-0000-0000-0000-000000000001', 'Lulu Hypermarket Building Block C,2835', 'Karama Central', 'Lulu Hypermarket Building Block C,2835, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-227', 'b0000000-0000-0000-0000-000000000001', 'Chittilapilly Building', 'Karama Central', 'Chittilapilly Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-228', 'b0000000-0000-0000-0000-000000000001', 'Sunrice Building', 'Karama Central', 'Sunrice Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-229', 'b0000000-0000-0000-0000-000000000001', 'Sheikh Mariyam Building', 'Karama Central', 'Sheikh Mariyam Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-230', 'b0000000-0000-0000-0000-000000000001', 'Karama center', 'Karama Central', 'Karama center, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-231', 'b0000000-0000-0000-0000-000000000001', 'Dar al Karama', 'Karama Central', 'Dar al Karama, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-232', 'b0000000-0000-0000-0000-000000000001', 'Dhe Fish building', 'Karama Central', 'Dhe Fish building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-233', 'b0000000-0000-0000-0000-000000000001', 'Al Hilal A Block', 'Karama Central', 'Al Hilal A Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-234', 'b0000000-0000-0000-0000-000000000001', 'Pioneer Building 8', '🟡 Park, Pioneer & ADCB', 'Pioneer Building 8, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-235', 'b0000000-0000-0000-0000-000000000001', 'Karama shopping complex
Block V', 'Karama Central', 'Karama shopping complex
Block V, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-236', 'b0000000-0000-0000-0000-000000000001', 'H Block Al Wasl', 'Karama Central', 'H Block Al Wasl, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-237', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl building, N block 2nd floor', '🟡 Park, Pioneer & ADCB', 'Al Wasl building, N block 2nd floor, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-238', 'b0000000-0000-0000-0000-000000000001', 'Tareeq al karama cars building', 'Karama Central', 'Tareeq al karama cars building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-239', 'b0000000-0000-0000-0000-000000000001', 'R8', 'Karama Central', 'R8, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-240', 'b0000000-0000-0000-0000-000000000001', 'May flower building', 'Karama Central', 'May flower building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-241', 'b0000000-0000-0000-0000-000000000001', 'Life Pharmacy Building May Flower opposite', 'Karama Central', 'Life Pharmacy Building May Flower opposite, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-242', 'b0000000-0000-0000-0000-000000000001', 'Unique Business Center', '🟠 Burjman & Mankhool', 'Unique Business Center, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-243', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl W Block', '🟡 Park, Pioneer & ADCB', 'Al Wasl W Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-244', 'b0000000-0000-0000-0000-000000000001', 'Al Mansoori', '🟡 Park, Pioneer & ADCB', 'Al Mansoori, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-245', 'b0000000-0000-0000-0000-000000000001', 'Karama Palace Building', '🟠 Burjman & Mankhool', 'Karama Palace Building, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-246', 'b0000000-0000-0000-0000-000000000001', 'Shahi Mugal Restaurnat,Near Burjman Metro Station Exit 2', '🟠 Burjman & Mankhool', 'Shahi Mugal Restaurnat,Near Burjman Metro Station Exit 2, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-247', 'b0000000-0000-0000-0000-000000000001', 'Al Dubaiba Building', '🟠 Burjman & Mankhool', 'Al Dubaiba Building, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-248', 'b0000000-0000-0000-0000-000000000001', 'Centrepoint building mankhool', '🟠 Burjman & Mankhool', 'Centrepoint building mankhool, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-249', 'b0000000-0000-0000-0000-000000000001', 'Al Mankhook, Al nada 1', '🟠 Burjman & Mankhool', 'Al Mankhook, Al nada 1, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-250', 'b0000000-0000-0000-0000-000000000001', 'Sheikh Mariyam Building', '🟡 Park, Pioneer & ADCB', 'Sheikh Mariyam Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-251', 'b0000000-0000-0000-0000-000000000001', 'Shaikha Mariyam', '🟡 Park, Pioneer & ADCB', 'Shaikha Mariyam, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-252', 'b0000000-0000-0000-0000-000000000001', 'Building no 59', '🟡 Park, Pioneer & ADCB', 'Building no 59, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-253', 'b0000000-0000-0000-0000-000000000001', 'New Sinclair NS 252', '🟡 Park, Pioneer & ADCB', 'New Sinclair NS 252, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-254', 'b0000000-0000-0000-0000-000000000001', 'Kings Building(Step Building)', '🟡 Park, Pioneer & ADCB', 'Kings Building(Step Building), 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-255', 'b0000000-0000-0000-0000-000000000001', 'Vegme Building', '🟡 Park, Pioneer & ADCB', 'Vegme Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-256', 'b0000000-0000-0000-0000-000000000001', 'Modern Pharmacy', '🟡 Park, Pioneer & ADCB', 'Modern Pharmacy, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-257', 'b0000000-0000-0000-0000-000000000001', 'Star of Karama - B Block', '🟡 Park, Pioneer & ADCB', 'Star of Karama - B Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-258', 'b0000000-0000-0000-0000-000000000001', 'Pioneer building 27', '🟡 Park, Pioneer & ADCB', 'Pioneer building 27, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-259', 'b0000000-0000-0000-0000-000000000001', 'Little Uzi building', '🟡 Park, Pioneer & ADCB', 'Little Uzi building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-260', 'b0000000-0000-0000-0000-000000000001', 'Keerthi Building', '🟢 Karama Center - Pyramid', 'Keerthi Building, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-261', 'b0000000-0000-0000-0000-000000000001', 'Star 1 -B -Block', '🟢 Karama Center - Pyramid', 'Star 1 -B -Block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-262', 'b0000000-0000-0000-0000-000000000001', 'Madina Building', '🟣 Hamdan Colony & Post', 'Madina Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-263', 'b0000000-0000-0000-0000-000000000001', 'Ayhaco building (Madina Building)', '🟣 Hamdan Colony & Post', 'Ayhaco building (Madina Building), 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-264', 'b0000000-0000-0000-0000-000000000001', 'G 8 Building', '🟣 Hamdan Colony & Post', 'G 8 Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-265', 'b0000000-0000-0000-0000-000000000001', 'Era', '🟠 Burjman & Mankhool', 'Era, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-266', 'b0000000-0000-0000-0000-000000000001', 'Mashribia Building', '🟠 Burjman & Mankhool', 'Mashribia Building, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-267', 'b0000000-0000-0000-0000-000000000001', 'Star1 - A block', '🟢 Karama Center - Pyramid', 'Star1 - A block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-268', 'b0000000-0000-0000-0000-000000000001', 'Naboodah building
C block', '🟣 Hamdan Colony & Post', 'Naboodah building
C block, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-269', 'b0000000-0000-0000-0000-000000000001', 'Karama shopping complex - K Block', '🟡 Park, Pioneer & ADCB', 'Karama shopping complex - K Block, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-270', 'b0000000-0000-0000-0000-000000000001', 'Star Building A Block', '🟢 Karama Center - Pyramid', 'Star Building A Block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-271', 'b0000000-0000-0000-0000-000000000001', 'Lootha', '🟣 Hamdan Colony & Post', 'Lootha, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-272', 'b0000000-0000-0000-0000-000000000001', 'Building 74 ,', '🟣 Hamdan Colony & Post', 'Building 74 ,, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-273', 'b0000000-0000-0000-0000-000000000001', 'Emirates building ,opp green gate', '🟡 Park, Pioneer & ADCB', 'Emirates building ,opp green gate, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-274', 'b0000000-0000-0000-0000-000000000001', 'Bin Hyder 2', '🟢 Karama Center - Pyramid', 'Bin Hyder 2, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-275', 'b0000000-0000-0000-0000-000000000001', 'May Flower', '🟢 Karama Center - Pyramid', 'May Flower, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-276', 'b0000000-0000-0000-0000-000000000001', 'Al Rawdat building', '🟠 Burjman & Mankhool', 'Al Rawdat building, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-277', 'b0000000-0000-0000-0000-000000000001', 'Pyramid building Block C', '🟢 Karama Center - Pyramid', 'Pyramid building Block C, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-278', 'b0000000-0000-0000-0000-000000000001', 'Wide Range restaurant building', '🟡 Park, Pioneer & ADCB', 'Wide Range restaurant building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-279', 'b0000000-0000-0000-0000-000000000001', 'Life pharma building', '🟡 Park, Pioneer & ADCB', 'Life pharma building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-280', 'b0000000-0000-0000-0000-000000000001', 'Target Building', '🟣 Hamdan Colony & Post', 'Target Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-281', 'b0000000-0000-0000-0000-000000000001', 'B6 Dhe fish building', '🟣 Hamdan Colony & Post', 'B6 Dhe fish building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-282', 'b0000000-0000-0000-0000-000000000001', 'Alankar Shopping Centre', '🟢 Karama Center - Pyramid', 'Alankar Shopping Centre, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-283', 'b0000000-0000-0000-0000-000000000001', 'Sheikh Mariyam', '🟡 Park, Pioneer & ADCB', 'Sheikh Mariyam, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-284', 'b0000000-0000-0000-0000-000000000001', 'Mirchiwala', '🟠 Burjman & Mankhool', 'Mirchiwala, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-285', 'b0000000-0000-0000-0000-000000000001', 'Ammayi Thakkaram Building', '🟢 Karama Center - Pyramid', 'Ammayi Thakkaram Building, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-286', 'b0000000-0000-0000-0000-000000000001', 'Sirajuddin Building', '🟡 Park, Pioneer & ADCB', 'Sirajuddin Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-287', 'b0000000-0000-0000-0000-000000000001', 'Building No 44', '🟡 Park, Pioneer & ADCB', 'Building No 44, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-288', 'b0000000-0000-0000-0000-000000000001', 'Building 55 (behind ustad grills)', '🟣 Hamdan Colony & Post', 'Building 55 (behind ustad grills), 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-289', 'b0000000-0000-0000-0000-000000000001', 'Karama Shopping building K Block', '🟢 Karama Center - Pyramid', 'Karama Shopping building K Block, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-290', 'b0000000-0000-0000-0000-000000000001', 'R 3 Building', '🟣 Hamdan Colony & Post', 'R 3 Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-291', 'b0000000-0000-0000-0000-000000000001', 'Dhe FIsh', '🟣 Hamdan Colony & Post', 'Dhe FIsh, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-292', 'b0000000-0000-0000-0000-000000000001', 'Adnan Building', '🟣 Hamdan Colony & Post', 'Adnan Building, 🟣 Hamdan Colony & Post, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-293', 'b0000000-0000-0000-0000-000000000001', 'A9 Building,', '🟡 Park, Pioneer & ADCB', 'A9 Building,, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-294', 'b0000000-0000-0000-0000-000000000001', 'near Karama gold', '🟡 Park, Pioneer & ADCB', 'near Karama gold, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-295', 'b0000000-0000-0000-0000-000000000001', 'Sajaya Building', '🟡 Park, Pioneer & ADCB', 'Sajaya Building, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-296', 'b0000000-0000-0000-0000-000000000001', 'Al Mashrabia, Building', '🟠 Burjman & Mankhool', 'Al Mashrabia, Building, 🟠 Burjman & Mankhool, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-297', 'b0000000-0000-0000-0000-000000000001', 'Al Hilal Block A', '🟡 Park, Pioneer & ADCB', 'Al Hilal Block A, 🟡 Park, Pioneer & ADCB, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-298', 'b0000000-0000-0000-0000-000000000001', 'Name', 'Karama Central', 'Name, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-299', 'b0000000-0000-0000-0000-000000000001', 'Thahir A', 'Karama Central', 'Thahir A, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-300', 'b0000000-0000-0000-0000-000000000001', 'Mas Express cargo', 'Karama Central', 'Mas Express cargo, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-301', 'b0000000-0000-0000-0000-000000000001', 'Kavery - 3rd Block', 'Karama Central', 'Kavery - 3rd Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-302', 'b0000000-0000-0000-0000-000000000001', '52', 'Karama Central', '52, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-303', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl - R 404', 'Karama Central', 'Al Wasl - R 404, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-304', 'b0000000-0000-0000-0000-000000000001', 'Cool And Bright', 'Karama Central', 'Cool And Bright, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-305', 'b0000000-0000-0000-0000-000000000001', 'Al Wasl -L Block', 'Karama Central', 'Al Wasl -L Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-306', 'b0000000-0000-0000-0000-000000000001', 'Lulu Electronics', 'Karama Central', 'Lulu Electronics, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-307', 'b0000000-0000-0000-0000-000000000001', 'Al Hilal -A Block', 'Karama Central', 'Al Hilal -A Block, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-308', 'b0000000-0000-0000-0000-000000000001', 'G 8 Building', 'Karama Central', 'G 8 Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-309', 'b0000000-0000-0000-0000-000000000001', 'Al Amani Building', 'Karama Central', 'Al Amani Building, Karama Central, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;
INSERT INTO public.buildings (id, business_id, name, area, address, total_floors)
VALUES ('bld-310', 'b0000000-0000-0000-0000-000000000001', 'Star of Karama', '🟢 Karama Center - Pyramid', 'Star of Karama, 🟢 Karama Center - Pyramid, Dubai', 5)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, area = EXCLUDED.area;

-- 2. CUSTOMERSINSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-101', 'b0000000-0000-0000-0000-000000000001', 'CUST-101', 'Saran', '+971 50 5670387', 'saran@example.ae', 'bld-1', '110', 'mp-2-times-ld', false, true, true, 310, '2 Time ,Lunch And Dinner', '2026-10-06', '2026-10-06', 'active', 'Late payer', 'Dues will clear by Nov beginning')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-102', 'b0000000-0000-0000-0000-000000000001', 'CUST-102', 'Eugene', '+971 50 8786241', 'eugene@example.ae', 'bld-2', '101', 'mp-2-times-ld', false, true, true, 310, 'Deliver at 6 am no chicken items | Starting from 14 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 14 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-103', 'b0000000-0000-0000-0000-000000000001', 'CUST-103', 'Fayas', '+971 50 3323640', 'fayas@example.ae', 'bld-1', '211', 'mp-3-times', true, true, true, 380, '📍No chapati
📍No fish curry
📍No porota | Starting from 1 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-104', 'b0000000-0000-0000-0000-000000000001', 'CUST-104', 'Varsha', '+971 50 4763486', 'varsha@example.ae', 'bld-1', '211', 'mp-3-times', true, true, true, 380, '📍No chapati
📍No fish curry
📍No porota | Starting from 1 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-105', 'b0000000-0000-0000-0000-000000000001', 'CUST-105', 'Jebeesh', '+971 50 6549157', 'jebeesh@example.ae', 'bld-3', '108', 'mp-2-times-ld', false, true, true, 310, 'Starting from 16th Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Good', 'Starting from 16th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-106', 'b0000000-0000-0000-0000-000000000001', 'CUST-106', 'Arun', '+971 50 9950091', 'arun@example.ae', 'bld-4', '303', 'mp-2-times-bd', true, false, true, 300, 'No fish | No Fish', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Followed on 9 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-107', 'b0000000-0000-0000-0000-000000000001', 'CUST-107', 'Laiju', '+971 50 3583977', 'laiju@example.ae', 'bld-4', '303', 'mp-3-times', true, true, true, 380, '3 Time,No Rice', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Followed on 9 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-108', 'b0000000-0000-0000-0000-000000000001', 'CUST-108', 'Rithik', '+971 50 6202410', 'rithik@example.ae', 'bld-4', '303', 'mp-2-times-ld', false, true, true, 310, 'No Fish, No rice, No Biriyani | 2 Time , Lunch and Dinner,No Fish,No rice no Biriyani', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Followed on 9 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-109', 'b0000000-0000-0000-0000-000000000001', 'CUST-109', 'Jestin', '+971 50 3759804', 'jestin@example.ae', 'bld-5', '201', 'mp-3-times', true, true, true, 380, 'No Fish curry Need egg or any alternative | 3 Time  ,Start from 30th July 2026', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Followed on 9 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-110', 'b0000000-0000-0000-0000-000000000001', 'CUST-110', 'Akhil', '+971 50 7029534', 'akhil@example.ae', 'bld-5', '206', 'mp-3-times', true, true, true, 380, 'No chapathi set for dinner - Need any alternative | No fish curry | 📌Lunch: Chapati set only instead of normal meals. Special items are fine for lunch | 2 Time,Breakfast and Dinner, No chapathi set for dinner - Need any alternative,No fish curry | 📌Lunch: Chapati set only instead of normal meals. Special items are fine for lunch', '2026-10-15', '2026-10-15', 'active', 'Late payer', 'Oct month balance 204 & Nov month 380 will be paid in the 1st week of Nov 202')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-111', 'b0000000-0000-0000-0000-000000000001', 'CUST-111', 'Rizwan', '+971 50 7723619', 'rizwan@example.ae', 'bld-5', '211', 'mp-3-times', true, true, true, 380, 'Starting from 14 September 2026 ✅', '2026-10-13', '2026-10-13', 'active', 'Good', 'Starting from 14 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-112', 'b0000000-0000-0000-0000-000000000001', 'CUST-112', 'Naveen', '+971 50 3067055', 'naveen@example.ae', 'bld-5', '211', 'mp-1-time-lunch', false, true, false, 186, 'Lunch: Chapathi set instead of normal meal

Special items are fine | Start from 9th Oct 2026✅', '2026-11-07', '2026-11-07', 'active', 'Good', 'Start from 9th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-113', 'b0000000-0000-0000-0000-000000000001', 'CUST-113', 'Jebin', '+971 50 7561159', 'jebin@example.ae', 'bld-6', '105', 'mp-2-times-ld', false, true, true, 310, 'Lunch & dinner
Start from 11th June 2026✅ | Please deliver inside', '2026-10-31', '2026-10-31', 'active', 'Good', 'Lunch & dinner
Start from 11th June 2026✅ | Please deliver inside')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-114', 'b0000000-0000-0000-0000-000000000001', 'CUST-114', 'Jesly', '+971 50 3041461', 'jesly@example.ae', 'bld-7', '310-R3', 'mp-2-times-ld', false, true, true, 310, 'Sunday no food needed | 2 Time, Lunch and DinnerStart From 2nd July2026', '2026-09-30', '2026-09-30', 'active', 'Late payer', '2 Time, Lunch and DinnerStart From 2nd July2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-115', 'b0000000-0000-0000-0000-000000000001', 'CUST-115', 'Majid', '+971 50 3556169', 'majid@example.ae', 'bld-1', '403', 'mp-2-times-bd', true, false, true, 300, '✅ BF & DN only from 6th Oct | Start from 22nd Sep 2026✅ BF & DN only from 6th Oct', '2026-10-31', '2026-10-31', 'active', 'Good', 'Start from 22nd Sep 2026✅ BF & DN only from 6th Oct')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-116', 'b0000000-0000-0000-0000-000000000001', 'CUST-116', 'Fadia', '+971 50 6649736', 'fadia@example.ae', 'bld-8', '515', 'mp-2-times-ld', false, true, true, 310, 'Saturday and Sunday no food | 
No egg curry, need any alternative | 1 Time,Lunch Only,Monday to Friday ,Start from 9th 2026 Dinner starts from sep 1 Saturday and Sunday no food', '2026-10-25', '2026-10-25', 'active', 'Good', '1 Time,Lunch Only,Monday to Friday ,Start from 9th 2026 Dinner starts from sep 1 Saturday and Sunday no food')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-117', 'b0000000-0000-0000-0000-000000000001', 'CUST-117', 'EVA', '+971 50 9263514', 'eva@example.ae', 'bld-9', '303', 'mp-1-time-dinner', false, false, true, 150, '3 Time,Start From 13th July2026', '2026-09-18', '2026-09-18', 'active', 'Late payer', '3 Time,Start From 13th July2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-118', 'b0000000-0000-0000-0000-000000000001', 'CUST-118', 'Nithin', '+971 50 6953312', 'nithin@example.ae', 'bld-10', 'Flat No: 104', 'mp-2-times-ld', false, true, true, 310, 'No normal rice - Need Chapathi set for lunch , No fish items  Special items are fine | Lunch only | No normal rice - Need Chapathi set, No fish items  Special items are fine | Start from 3rd Aug 2026✅', '2026-10-30', '2026-10-30', 'active', 'Late payer', 'Lunch only | No normal rice - Need Chapathi set, No fish items  Special items are fine | Start from 3rd Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-119', 'b0000000-0000-0000-0000-000000000001', 'CUST-119', 'Devan', '+971 50 4217169', 'devan@example.ae', 'bld-11', '302', 'mp-2-times-ld', true, true, false, 310, 'No fish items | Start from 12th Oct 2026✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Start from 12th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-120', 'b0000000-0000-0000-0000-000000000001', 'CUST-120', 'Arun', '+971 50 3035855', 'arun@example.ae', 'bld-12', '201', 'mp-3-times', true, true, true, 380, 'Deliver at 6:15 am | No fish curry | Start from 7th Oct 2026✅ | No fish curry', '2026-10-13', '2026-10-13', 'active', 'Late payer', 'Start from 7th Oct 2026✅ | No fish curry')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-121', 'b0000000-0000-0000-0000-000000000001', 'CUST-121', 'Shanmugha vel', '+971 50 4019004', 'shanmughavel@example.ae', 'bld-11', '301', 'mp-3-times', true, true, true, 380, '📍No beef items ❗️No mota, need barik | Start from 22th Oct 2026✅ 10 days trail', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Start from 22th Oct 2026✅ 10 days trail')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-122', 'b0000000-0000-0000-0000-000000000001', 'CUST-122', 'Faiz', '+971 50 1902442', 'faiz@example.ae', 'bld-13', '106', 'mp-2-times-ld', false, true, true, 310, 'Starting from 1 September 2026 ✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-123', 'b0000000-0000-0000-0000-000000000001', 'CUST-123', 'Ajmal', '+971 50 7767773', 'ajmal@example.ae', 'bld-13', '106', 'mp-2-times-ld', false, true, true, 310, 'Starting from 1 September 2026 ✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-124', 'b0000000-0000-0000-0000-000000000001', 'CUST-124', 'Fahiz', '+971 50 1199918', 'fahiz@example.ae', 'bld-14', '601', 'mp-2-times-ld', false, true, true, 310, 'Starting from 9 September 2026✅', '2026-10-08', '2026-10-08', 'active', 'Good', 'Starting from 9 September 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-125', 'b0000000-0000-0000-0000-000000000001', 'CUST-125', 'Umair', '+971 50 6617726', 'umair@example.ae', 'bld-15', '601', 'mp-2-times-ld', false, true, true, 310, 'Start from 21st Sep 2026✅', '2026-10-20', '2026-10-20', 'active', 'Late payer', 'Start from 21st Sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-126', 'b0000000-0000-0000-0000-000000000001', 'CUST-126', 'Jerin', '+971 50 1187834', 'jerin@example.ae', 'bld-15', '601', 'mp-2-times-bd', true, false, true, 300, 'Starting from tomorrow 21 October 2026✅ Cancel on 4 th November 2026❌', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Starting from tomorrow 21 October 2026✅ Cancel on 4 th November 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-127', 'b0000000-0000-0000-0000-000000000001', 'CUST-127', 'Deepan', '+971 50 9373478', 'deepan@example.ae', 'bld-16', '132', 'mp-1-time-lunch', false, true, false, 186, 'Deliver at 6:15 AM | Cancel on 31st Oct❌ | Start from 7th Oct 2026✅ Cancelling on oct 31❌', '2026-10-31', '2026-10-31', 'paused', 'Good', 'Start from 7th Oct 2026✅ Cancelling on oct 31❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-128', 'b0000000-0000-0000-0000-000000000001', 'CUST-128', 'Hashim', '+971 50 6567132', 'hashim@example.ae', 'bld-17', '502', 'mp-3-times', true, true, true, 380, 'Starting from 23 August 2026✅ Restart  From 15 October 2026', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 23 August 2026✅ Restart  From 15 October 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-129', 'b0000000-0000-0000-0000-000000000001', 'CUST-129', 'Adil', '+971 50 3055654', 'adil@example.ae', 'bld-18', '22', 'mp-3-times', true, true, true, 380, 'Monday to Friday No mota - Need barik
Special items are fine | Start from 1st Oct 2026✅', '2026-10-30', '2026-10-30', 'active', 'Late payer', 'Start from 1st Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-130', 'b0000000-0000-0000-0000-000000000001', 'CUST-130', 'Nithin(Loshna)', '+971 50 6485133', 'nithinloshna@example.ae', 'bld-19', '312', 'mp-1-time-lunch', false, true, false, 186, 'Deliver at 6 am | Start from 21st Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Start from 21st Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-131', 'b0000000-0000-0000-0000-000000000001', 'CUST-131', 'Anjo', '+971 50 8049503', 'anjo@example.ae', 'bld-20', '24', 'mp-2-times-ld', false, true, true, 310, 'Deliver @ 5:45 AM | Cancel on 31st Oct 2026❌ | Start from 12 Oct 2026✅', '2026-09-01', '2026-10-01', 'paused', 'Late payer', 'Start from 12 Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-132', 'b0000000-0000-0000-0000-000000000001', 'CUST-132', 'Dhanu', '+971 50 9218611', 'dhanu@example.ae', 'bld-20', '24', 'mp-2-times-ld', false, true, true, 310, 'No Beef  Deliver @ 5:45 AM | Cancel on 31st Oct 2026❌ | Start from 12 Oct 2026✅', '2026-09-01', '2026-10-01', 'paused', 'Late payer', 'Start from 12 Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-133', 'b0000000-0000-0000-0000-000000000001', 'CUST-133', 'Juvel', '+971 50 9075447', 'juvel@example.ae', 'bld-20', '24', 'mp-2-times-ld', false, true, true, 310, 'Deliver @ 5:45 AM | Cancel on 31st Oct 2026❌ | Start from 12 Oct 2026✅', '2026-09-01', '2026-10-01', 'paused', 'Late payer', 'Start from 12 Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-134', 'b0000000-0000-0000-0000-000000000001', 'CUST-134', 'Ragila', '+971 50 3132332', 'ragila@example.ae', 'bld-21', '17', 'mp-2-times-ld', true, true, false, 310, 'Start from 9th Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Start from 9th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-135', 'b0000000-0000-0000-0000-000000000001', 'CUST-135', 'Sruthy', '+971 50 1981209', 'sruthy@example.ae', 'bld-21', '305', 'mp-3-times', true, true, true, 380, 'Deliver@ 5:45 AM | Passcode: 4695# Start from 21 Sep 2026✅ 3 Times from 1 Oct', '2026-10-30', '2026-10-30', 'active', 'Late payer', '10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-136', 'b0000000-0000-0000-0000-000000000001', 'CUST-136', 'Anju', '+971 50 6954179', 'anju@example.ae', 'bld-21', '17', 'mp-2-times-ld', false, true, true, 310, 'No wheat dosa, need chapathi instead | Start from 10 Oct 2026✅', '2026-11-08', '2026-11-08', 'active', 'Good', 'Start from 10 Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-137', 'b0000000-0000-0000-0000-000000000001', 'CUST-137', 'Aneesh', '+971 50 5670297', 'aneesh@example.ae', 'bld-22', '104', 'mp-1-time-lunch', false, true, false, 186, 'No food on all Sundays', '2026-10-31', '2026-10-31', 'active', 'Good', 'Active customer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-138', 'b0000000-0000-0000-0000-000000000001', 'CUST-138', 'Murshid', '+971 50 7960022', 'murshid@example.ae', 'bld-23', '23', 'mp-1-time-dinner', false, false, true, 150, 'No appam,no kuboos,no dal,No velleppam |  lunch @ noon | No appam,no kuboos,no dal,No velleppam |', '2026-08-31', '2026-08-31', 'active', 'Late payer', '216 will pay on Oct 11th & Balance will do by Oct last')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-139', 'b0000000-0000-0000-0000-000000000001', 'CUST-139', 'Reshma', '+971 50 8172374', 'reshma@example.ae', 'bld-24', '33', 'mp-2-times-bd', true, false, true, 300, 'Starting from 30th Sep 2026✅', '2026-10-29', '2026-10-29', 'active', 'Late payer', 'Starting from 30th Sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-140', 'b0000000-0000-0000-0000-000000000001', 'CUST-140', 'Anjaldas', '+971 50 5523080', 'anjaldas@example.ae', 'bld-25', '206', 'mp-1-time-dinner', false, false, true, 150, 'please keep food above the fridge | Starting from 14 September 2026✅', '2026-10-14', '2026-10-14', 'active', 'Good', 'Starting from 14 September 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-141', 'b0000000-0000-0000-0000-000000000001', 'CUST-141', 'Jancy', '+971 50 3668878', 'jancy@example.ae', 'bld-26', '215', 'mp-2-times-ld', true, true, false, 310, '3 Time,Lunch', '2026-08-31', '2026-08-31', 'active', 'Late payer', '3 Time,Lunch')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-142', 'b0000000-0000-0000-0000-000000000001', 'CUST-142', 'Aaromal', '+971 50 2707025', 'aaromal@example.ae', 'bld-27', '106', 'mp-2-times-ld', false, true, true, 310, '2 Time. Lunch & Dinner', '2026-10-31', '2026-10-31', 'active', 'Good', '2 Time. Lunch & Dinner')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-143', 'b0000000-0000-0000-0000-000000000001', 'CUST-143', 'Remith', '+971 50 9670019', 'remith@example.ae', 'bld-28', '105', 'mp-2-times-ld', false, true, true, 310, 'Lunch and Dinner,6.30 Am,Dinner Rice | No plastic container | 2 Time ,Lunch and Dinner,6.30 Am,Dinner Rice | No plastic container', '2026-10-31', '2026-10-31', 'active', 'Good', '2 Time ,Lunch and Dinner,6.30 Am,Dinner Rice | No plastic container')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-144', 'b0000000-0000-0000-0000-000000000001', 'CUST-144', 'Akhil', '+971 50 4054416', 'akhil@example.ae', 'bld-29', '303', 'mp-2-times-ld', false, true, true, 310, 'Cancelling on 31st Oct 2026❌ | Start from 8th oct 2026✅', '2026-10-31', '2026-10-31', 'paused', 'Good', 'Start from 8th oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-145', 'b0000000-0000-0000-0000-000000000001', 'CUST-145', 'Nimya', '+971 50 1702842', 'nimya@example.ae', 'bld-30', '301', 'mp-2-times-ld', false, true, true, 310, 'No velleppam | Starting from 15 Oct 2026✅', '2026-11-13', '2026-11-13', 'active', 'Good', 'Starting from 15 Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-146', 'b0000000-0000-0000-0000-000000000001', 'CUST-146', 'Radhul', '+971 50 5136509', 'radhul@example.ae', 'bld-31', '305', 'mp-3-times', true, true, true, 380, 'Starting from tomorrow 15  October 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Starting from tomorrow 15  October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-147', 'b0000000-0000-0000-0000-000000000001', 'CUST-147', 'Kailas', '+971 50 9825625', 'kailas@example.ae', 'bld-32', '23rd room', 'mp-2-times-ld', false, true, true, 310, 'No fish curry,  Fish fry is fine | Lunch & dinner | No fish curry, 
Fish fry is fine
Start from 16th June 2026✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Lunch & dinner | No fish curry, 
Fish fry is fine
Start from 16th June 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-148', 'b0000000-0000-0000-0000-000000000001', 'CUST-148', 'Aswathy', '+971 50 2244706', 'aswathy@example.ae', 'bld-33', '206', 'mp-2-times-ld', true, true, false, 310, 'Dinner Deliver @ 6.Am | 2 Time , Lunch and Dinner Deliver @ 6.Am', '2026-10-31', '2026-10-31', 'active', 'Good', '2 Time , Lunch and Dinner Deliver @ 6.Am')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-149', 'b0000000-0000-0000-0000-000000000001', 'CUST-149', 'Soumya', '+971 50 9523427', 'soumya@example.ae', 'bld-33', '302', 'mp-2-times-ld', false, true, true, 310, 'Deliver @ 5:45 AM | Start from 1st October 2026✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Start from 1st October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-150', 'b0000000-0000-0000-0000-000000000001', 'CUST-150', 'Hafiz', '+971 50 9751135', 'hafiz@example.ae', 'bld-34', '9A', 'mp-1-time-dinner', false, false, true, 150, 'No wheat dosa
No appam
No kuruma
Please follow normal menu except the above | 1 Time ,Dinner Only', '2026-10-09', '2026-10-09', 'active', 'Late payer', 'followed on 3 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-151', 'b0000000-0000-0000-0000-000000000001', 'CUST-151', 'Fawaz', '+971 50 9883603', 'fawaz@example.ae', 'bld-34', '9A', 'mp-1-time-dinner', false, false, true, 150, 'No wheat dosa
No appam
No kuruma
Please follow normal menu except the above | 1 Time ,Dinner Only', '2026-10-09', '2026-10-09', 'active', 'Late payer', 'followed on 3 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-152', 'b0000000-0000-0000-0000-000000000001', 'CUST-152', 'Rashid', '+971 50 2062921', 'rashid@example.ae', 'bld-35', '301/5', 'mp-2-times-ld', false, true, true, 310, '3 Time  ,Start from 1st July 2026', '2026-10-31', '2026-10-31', 'active', 'Good', '3 Time  ,Start from 1st July 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-153', 'b0000000-0000-0000-0000-000000000001', 'CUST-153', 'Swetha', '+971 50 1627314', 'swetha@example.ae', 'bld-36', '206', 'mp-2-times-ld', false, true, true, 310, 'No Beef | Start from 1st Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Good', 'Start from 1st Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-154', 'b0000000-0000-0000-0000-000000000001', 'CUST-154', 'Sheeja', '+971 50 1656659', 'sheeja@example.ae', 'bld-37', '24', 'mp-2-times-ld', false, true, true, 310, 'Start from 1st Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Start from 1st Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-155', 'b0000000-0000-0000-0000-000000000001', 'CUST-155', 'Abid', '+971 50 4037617', 'abid@example.ae', 'bld-37', '12', 'mp-2-times-ld', false, true, true, 310, 'No beef, no porotta | Starting from 7 September 2026✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 7 September 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-156', 'b0000000-0000-0000-0000-000000000001', 'CUST-156', 'Kiran', '+971 50 4255199', 'kiran@example.ae', 'bld-37', '23', 'mp-2-times-ld', false, true, true, 310, 'Start from 23rd Sep 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', '70 Aed Paid')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-157', 'b0000000-0000-0000-0000-000000000001', 'CUST-157', 'Ambras', '+971 50 1213525', 'ambras@example.ae', 'bld-38', '12', 'mp-2-times-ld', false, true, true, 310, 'Morning Delivery 6.30 Am,No Fish curry for Lunch | Morning Delivery 6.30 Am,No Fish curry for Lunch, start From 6th July02026', '2026-10-31', '2026-10-31', 'active', 'Good', 'Morning Delivery 6.30 Am,No Fish curry for Lunch, start From 6th July02026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-158', 'b0000000-0000-0000-0000-000000000001', 'CUST-158', 'Damian', '+971 50 7541608', 'damian@example.ae', 'bld-39', '35', 'mp-2-times-ld', false, true, true, 310, 'Deliver 6.45 AM | Sunday: Chicken biriyani
| Lunch & Dinner on all other days: Chapathi set only | 2 Time,Lunch and Dinner ,c,Start from 9th 2026', '2026-09-27', '2026-09-27', 'active', 'Late payer', '2 Time,Lunch and Dinner ,c,Start from 9th 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-159', 'b0000000-0000-0000-0000-000000000001', 'CUST-159', 'Anas', '+971 50 7381341', 'anas@example.ae', 'bld-39', '35', 'mp-2-times-ld', false, true, true, 310, 'No fish  items need egg instead      Lunch -Chappathi only | Starting from tomorrow 7 October 2026✅', '2026-10-07', '2026-10-07', 'active', 'Good', 'Starting from tomorrow 7 October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-160', 'b0000000-0000-0000-0000-000000000001', 'CUST-160', 'Shan', '+971 50 4780003', 'shan@example.ae', 'bld-39', '35', 'mp-3-times', true, true, true, 380, '📌Lunch - No meals , need Chappathi set instead 📌Special items are fine | starting from tomorrow 19 October 2026✅', '2026-09-01', '2026-10-01', 'active', 'Good', 'starting from tomorrow 19 October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-161', 'b0000000-0000-0000-0000-000000000001', 'CUST-161', 'Visakh', '+971 50 7039421', 'visakh@example.ae', 'bld-40', '28', 'mp-2-times-ld', false, true, true, 310, '2 Time,Lunch and Dinner ,Start from 11th 2026', '2026-10-08', '2026-10-08', 'active', 'Good', '2 Time,Lunch and Dinner ,Start from 11th 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-162', 'b0000000-0000-0000-0000-000000000001', 'CUST-162', 'Fasil', '+971 50 4000379', 'fasil@example.ae', 'bld-41', 'C -1', 'mp-1-time-lunch', false, true, false, 186, 'Barik rice,No fish items - Need egg instead Need half rice and chapathi | 1 Time, Lunch Only, Barik rice,No fish items - Need egg instead', '2026-09-30', '2026-09-30', 'active', 'Late payer', '1 Time, Lunch Only, Barik rice,No fish items - Need egg instead')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-163', 'b0000000-0000-0000-0000-000000000001', 'CUST-163', 'Salam', '+971 50 7395681', 'salam@example.ae', 'bld-41', 'C -1', 'mp-1-time-lunch', false, true, false, 186, 'Need half rice anf Chapathi 17 to 21 dont deliver food | 1 Time', '2026-10-31', '2026-10-31', 'active', 'Good', '1 Time')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-164', 'b0000000-0000-0000-0000-000000000001', 'CUST-164', 'Ajimsha', '+971 50 4605247', 'ajimsha@example.ae', 'bld-41', 'C-1', 'mp-3-times', true, true, true, 380, 'Start from 21st Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Good', 'Start from 21st Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-165', 'b0000000-0000-0000-0000-000000000001', 'CUST-165', 'Shamnas', '+971 50 4495999', 'shamnas@example.ae', 'bld-42', 'C 1', 'mp-1-time-lunch', false, true, false, 186, '1 Time,Lunch Only ,1/2 Rice', '2026-09-30', '2026-09-30', 'active', 'Late payer', '1 Time,Lunch Only ,1/2 Rice')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-166', 'b0000000-0000-0000-0000-000000000001', 'CUST-166', 'Anandu', '+971 50 8986213', 'anandu@example.ae', 'bld-43', '31', 'mp-3-times', true, true, true, 380, 'No wheat dosa, need any alternative | 3Times ,Start From 21st July 2026, Need to ring after delivery, No wheat dosa, need any alternative', '2026-10-31', '2026-10-31', 'active', 'Good', '3Times ,Start From 21st July 2026, Need to ring after delivery, No wheat dosa, need any alternative')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-167', 'b0000000-0000-0000-0000-000000000001', 'CUST-167', 'Shyam', '+971 50 7397833', 'shyam@example.ae', 'bld-43', '31', 'mp-3-times', true, true, true, 380, 'No Fish | Starting from tomorrow  8  October 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Starting from tomorrow  8  October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-168', 'b0000000-0000-0000-0000-000000000001', 'CUST-168', 'Jerin', '+971 50 7518061', 'jerin@example.ae', 'bld-44', '36', 'mp-2-times-ld', false, true, true, 310, 'Starting from tomorrow 20 October 2926 ✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Starting from tomorrow 20 October 2926 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-169', 'b0000000-0000-0000-0000-000000000001', 'CUST-169', 'Asha', '+971 50 4958300', 'asha@example.ae', 'bld-45', '50', 'mp-2-times-ld', false, true, true, 310, '📍No fish curry. Need an egg omelette instead | 2 times', '2026-10-30', '2026-10-30', 'active', 'Bad', '2 times')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-170', 'b0000000-0000-0000-0000-000000000001', 'CUST-170', 'Renjith', '+971 50 8153653', 'renjith@example.ae', 'bld-46', '108', 'mp-2-times-bd', true, false, true, 300, 'No kappa | No putt | No parotta | Breakfast & Dinner | No kappa | No putt | No parotta | Start from 5th Aug 2026✅', '2026-10-02', '2026-10-02', 'active', 'Late payer', 'Breakfast & Dinner | No kappa | No putt | No parotta | Start from 5th Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-171', 'b0000000-0000-0000-0000-000000000001', 'CUST-171', 'Dilshad', '+971 50 4875285', 'dilshad@example.ae', 'bld-47', '1C', 'mp-1-time-lunch', false, true, false, 186, 'No fish fry Need omelette insted  |  Need Rice + chapathi  |  Deliver before 7 AM | Lunch only | No fish fry Need omelette insted  |  Need Rice + chapathi  |  Deliver before 7 AM   | Start from 6th Aug 2026✅', '2026-11-02', '2026-11-02', 'active', 'Good', 'Lunch only | No fish fry Need omelette insted  |  Need Rice + chapathi  |  Deliver before 7 AM   | Start from 6th Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-172', 'b0000000-0000-0000-0000-000000000001', 'CUST-172', 'Amir', '+971 50 3493580', 'amir@example.ae', 'bld-39', '35', 'mp-3-times', true, true, true, 380, '| Start from 6th Aug 2026✅', '2026-11-02', '2026-11-02', 'active', 'Late payer', '| Start from 6th Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-173', 'b0000000-0000-0000-0000-000000000001', 'CUST-173', 'Bibin', '+971 50 8994189', 'bibin@example.ae', 'bld-37', '23', 'mp-2-times-ld', false, true, true, 310, 'Start from 16th Aug 2026✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Start from 16th Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-174', 'b0000000-0000-0000-0000-000000000001', 'CUST-174', 'Jefin', '+971 50 3220354', 'jefin@example.ae', 'bld-48', '101', 'mp-2-times-ld', false, true, true, 310, 'Starting from 12 September 2026✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 12 September 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-175', 'b0000000-0000-0000-0000-000000000001', 'CUST-175', 'Sarath', '+971 50 5538941', 'sarath@example.ae', 'bld-49', '33', 'mp-1-time-dinner', false, false, true, 150, 'Monday to Friday - Dinner only | Saturday lunch and dinner, Sunday - lunch | No aloo curry | Monday to Friday - Dinner only                                                     Saturday lunch and dinner 
Sunday - lunch
Starting from 19 August 2026✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Monday to Friday - Dinner only                                                     Saturday lunch and dinner 
Sunday - lunch
Starting from 19 August 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-176', 'b0000000-0000-0000-0000-000000000001', 'CUST-176', 'Ijas', '+971 50 9476183', 'ijas@example.ae', 'bld-37', '23', 'mp-3-times', true, true, true, 380, 'Starting from 20 August 2026✅', '2026-09-18', '2026-09-18', 'active', 'Late payer', 'Starting from 20 August 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-177', 'b0000000-0000-0000-0000-000000000001', 'CUST-177', 'Deepa', '+971 50 7126562', 'deepa@example.ae', 'bld-50', '104', 'mp-3-times', true, true, true, 380, 'Lunch at noon      Lunch & dinner only from 25th Oct 2026 | Start from 25 Sep 2026✅', '2026-10-25', '2026-10-25', 'paused', 'Good', 'Start from 25 Sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-178', 'b0000000-0000-0000-0000-000000000001', 'CUST-178', 'Shameem', '+971 50 1169484', 'shameem@example.ae', 'bld-51', '205', 'mp-3-times', true, true, true, 380, '3 TIMES Starting from 3 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', '3 TIMES Starting from 3 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-179', 'b0000000-0000-0000-0000-000000000001', 'CUST-179', 'Praseetha', '+971 50 1421877', 'praseetha@example.ae', 'bld-52', '205', 'mp-2-times-bd', true, false, true, 300, 'No porota, No sausages, No rice items for dinner | Start from 6th Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Start from 6th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-180', 'b0000000-0000-0000-0000-000000000001', 'CUST-180', 'Sojisha', '+971 50 2056825', 'sojisha@example.ae', 'bld-30', '301', 'mp-1-time-lunch', false, true, false, 186, 'Cancel on 25 Oct 2026❌ | Starting from tomorrow 6 October 2026✅', '2026-11-04', '2026-11-04', 'paused', 'Good', 'Starting from tomorrow 6 October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-181', 'b0000000-0000-0000-0000-000000000001', 'CUST-181', 'Vipin', '+971 50 3365247', 'vipin@example.ae', 'bld-53', '213', 'mp-3-times', true, true, true, 380, 'Veg Only | Starting from 9 October 2026 ✅ Cancelling on 30th oct 2026❌', '2026-10-31', '2026-10-31', 'paused', 'Good', 'Starting from 9 October 2026 ✅ Cancelling on 30th oct 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-182', 'b0000000-0000-0000-0000-000000000001', 'CUST-182', 'John', '+971 50 7843864', 'john@example.ae', 'bld-54', '311', 'mp-3-times', true, true, true, 380, 'Deliver @ 6 am | Start from 24th Sep 2026✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Start from 24th Sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-183', 'b0000000-0000-0000-0000-000000000001', 'CUST-183', 'Fayis', '+971 50 3383612', 'fayis@example.ae', 'bld-55', '107', 'mp-2-times-bd', true, false, true, 300, 'Breakfast need 6 am Dinner need 6.30 pm 
On hold from 21st Oct ⚠️
Restart from this Saturday, 24th Oct 📌 | Starting from tomorrow 15 October 2026 ✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Starting from tomorrow 15 October 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-184', 'b0000000-0000-0000-0000-000000000001', 'CUST-184', 'Sujith', '+971 50 5893220', 'sujith@example.ae', 'bld-56', '308', 'mp-2-times-ld', false, true, true, 310, 'Delivery @ 7am | No porota- Need handmade chapathi only | Lunch & Dinner
Delivery @ 7am | No porota- Need handmade chapathi only', '2026-10-10', '2026-10-10', 'active', 'Late payer', 'Lunch & Dinner
Delivery @ 7am | No porota- Need handmade chapathi only')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-185', 'b0000000-0000-0000-0000-000000000001', 'CUST-185', 'Adarsh', '+971 50 7744011', 'adarsh@example.ae', 'bld-57', '2c', 'mp-1-time-lunch', false, true, false, 186, 'Lunch : No Meals, need CP Need Special items | Lunch only from oct 16 , No normal meals need chapathi , special items are fine', '2026-10-15', '2026-10-15', 'active', 'Late payer', 'Lunch only from oct 16 , No normal meals need chapathi , special items are fine')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-186', 'b0000000-0000-0000-0000-000000000001', 'CUST-186', 'Riyas', '+971 50 7103934', 'riyas@example.ae', 'bld-58', '106', 'mp-2-times-ld', false, true, true, 310, 'Lunch and dinner | Starting from 9 September 2026✅', '2026-09-08', '2026-09-08', 'active', 'Late payer', 'Starting from 9 September 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-187', 'b0000000-0000-0000-0000-000000000001', 'CUST-187', 'Shajo', '+971 50 6432863', 'shajo@example.ae', 'bld-59', '103', 'mp-3-times', true, true, true, 380, 'Starting from 14 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 14 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-188', 'b0000000-0000-0000-0000-000000000001', 'CUST-188', 'Suraj', '+971 50 4665357', 'suraj@example.ae', 'bld-60', '205', 'mp-2-times-ld', false, true, true, 310, 'Lunch : Need special items. No meals, need chapathi set instead                                                               Dinner: Chapathi set only for all days dinner | 2 Time (Lunch And Dinner)  | Cancelling on 28th Oct 2026❌', '2026-10-28', '2026-10-28', 'paused', 'Late payer', '2 Time (Lunch And Dinner)  | Cancelling on 28th Oct 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-189', 'b0000000-0000-0000-0000-000000000001', 'CUST-189', 'Vince', '+971 50 9011139', 'vince@example.ae', 'bld-61', '206', 'mp-2-times-ld', false, true, true, 310, 'Veg food  keep the food above the fridge | 2 Time Lunch and Dinner,Veg food | Cancel on 30th Oct 2026❌', '2026-10-30', '2026-10-30', 'active', 'Good', '2 Time Lunch and Dinner,Veg food | Cancel on 30th Oct 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-190', 'b0000000-0000-0000-0000-000000000001', 'CUST-190', 'Lijo', '+971 50 9136711', 'lijo@example.ae', 'bld-62', '203', 'mp-3-times', true, true, true, 380, '📌Breakfast: Normal menu
📌Lunch:Normal menu+Egg omlet for meals
📌Dinner: No kubboos, No porota; Need handmade chapathi instead 
📌Deliver @ 5:30 AM
❗️No food on Sundays 
❗️No breakfast & lunch on Mondays | Start from 13th Oct 2026✅ Cancelling on 30th Oct 2026❌', '2026-09-01', '2026-10-01', 'paused', 'Good', 'Start from 13th Oct 2026✅ Cancelling on 30th Oct 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-191', 'b0000000-0000-0000-0000-000000000001', 'CUST-191', 'Ajesh', '+971 50 8039574', 'ajesh@example.ae', 'bld-63', '5C', 'mp-3-times', true, true, true, 380, '📌No mota, need Barik rice only Deliver at 6am | Start from 6th Oct 2026✅', '2026-11-04', '2026-11-04', 'active', 'Good', 'Start from 6th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-192', 'b0000000-0000-0000-0000-000000000001', 'CUST-192', 'Midlaj', '+971 50 3749928', 'midlaj@example.ae', 'bld-64', '301', 'mp-1-time-lunch', false, true, false, 186, 'Lunch @ | 2 Time ,Lunch and Dinner, Lunch', '2026-08-31', '2026-08-31', 'active', 'Bad', '2 Time ,Lunch and Dinner, Lunch')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-193', 'b0000000-0000-0000-0000-000000000001', 'CUST-193', 'Assish', '+971 50 5582090', 'assish@example.ae', 'bld-65', '206', 'mp-2-times-bd', true, false, true, 300, 'keep food above the fridge | Cancelling on 30th Oct 2026❌ | 2 Time , Breakfast and Dinner,Delivery 5.00Am', '2026-09-30', '2026-09-30', 'paused', 'Late payer', '2 Time , Breakfast and Dinner,Delivery 5.00Am')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-194', 'b0000000-0000-0000-0000-000000000001', 'CUST-194', 'Nithin', '+971 50 3691390', 'nithin@example.ae', 'bld-66', '308', 'mp-2-times-ld', false, true, true, 310, 'No Porota need Chapathi for dinner | 2 Time , Lunch and Dinner,No Porota', '2026-10-31', '2026-10-31', 'active', 'Late payer', '2 Time , Lunch and Dinner,No Porota')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-195', 'b0000000-0000-0000-0000-000000000001', 'CUST-195', 'Akshay Gym', '+971 50 5287795', 'akshaygym@example.ae', 'bld-66', '308', 'mp-2-times-ld', false, true, true, 310, 'need chapathi for dinner | 2 Time  ,Lunch and DinnerStart from 30thJuly 2026', '2026-08-31', '2026-08-31', 'active', 'Late payer', '2 Time  ,Lunch and DinnerStart from 30thJuly 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-196', 'b0000000-0000-0000-0000-000000000001', 'CUST-196', 'Aneesh', '+971 50 8561094', 'aneesh@example.ae', 'bld-67', '103', 'mp-2-times-ld', false, true, true, 310, 'Lunch 12 Pm | 2 Time, Lunch and DinnerStart From 2nd July2026,Lunch 12 Pm', '2026-10-31', '2026-10-31', 'active', 'Good', '2 Time, Lunch and DinnerStart From 2nd July2026,Lunch 12 Pm')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-197', 'b0000000-0000-0000-0000-000000000001', 'CUST-197', 'Nithesh', '+971 50 7165813', 'nithesh@example.ae', 'bld-68', '208', 'mp-1-time-lunch', false, true, false, 186, 'Start from 4 Sep 2026✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Start from 4 Sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-198', 'b0000000-0000-0000-0000-000000000001', 'CUST-198', 'Ashmi', '+971 50 1003832', 'ashmi@example.ae', 'bld-69', '208', 'mp-2-times-ld', false, true, true, 310, 'Cancelling on 31st oct 2026❌ | 2 Time Lunch and Dinner, Start From 3th July 2026', '2026-09-01', '2026-10-01', 'paused', 'Late payer', 'Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-199', 'b0000000-0000-0000-0000-000000000001', 'CUST-199', 'Saji', '+971 50 1124695', 'saji@example.ae', 'bld-70', '103', 'mp-2-times-ld', true, true, false, 310, 'Lunch @ noon | Starting from 7th Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Starting from 7th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-200', 'b0000000-0000-0000-0000-000000000001', 'CUST-200', 'Abhay', '+971 50 9839693', 'abhay@example.ae', 'bld-71', '203', 'mp-3-times', true, true, true, 380, 'Deliver @ 5:45 AM | Start from 23rd Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Good', 'Start from 23rd Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-201', 'b0000000-0000-0000-0000-000000000001', 'CUST-201', 'Amal', '+971 50 6738581', 'amal@example.ae', 'bld-72', '206', 'mp-1-time-dinner', false, false, true, 150, '1 Time, Dinner OnlyStart From 23rd July2026', '2026-10-20', '2026-10-20', 'active', 'Late payer', '1 Time, Dinner OnlyStart From 23rd July2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-202', 'b0000000-0000-0000-0000-000000000001', 'CUST-202', 'Bibin', '+971 50 4093770', 'bibin@example.ae', 'bld-73', '103', 'mp-1-time-dinner', false, false, true, 150, 'Start from 6th Oct 2026✅', '2026-11-04', '2026-11-04', 'active', 'Good', 'Start from 6th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-203', 'b0000000-0000-0000-0000-000000000001', 'CUST-203', 'Abhijith', '+971 50 1861974', 'abhijith@example.ae', 'bld-74', '2c', 'mp-3-times', true, true, true, 380, '🚨 Strictly no wheat items Deliver @ 5:30 AM | Start from 15 Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Good', 'Start from 15 Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-204', 'b0000000-0000-0000-0000-000000000001', 'CUST-204', 'Hishanthan', '+971 50 5192081', 'hishanthan@example.ae', 'bld-75', '', 'mp-1-time-lunch', false, true, false, 186, 'Need Barik rice | Starting from tomorrow  5 October 2026 ✅', '2026-11-04', '2026-11-04', 'active', 'Late payer', '150 Paid')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-205', 'b0000000-0000-0000-0000-000000000001', 'CUST-205', 'Arya', '+971 50 1945433', 'arya@example.ae', 'bld-76', '420', 'mp-2-times-ld', false, true, true, 310, 'Start from 21st Oct 2026✅', '2026-11-19', '2026-11-19', 'active', 'Good', 'Start from 21st Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-206', 'b0000000-0000-0000-0000-000000000001', 'CUST-206', 'Krishna', '+971 50 9591771', 'krishna@example.ae', 'bld-77', '307', 'mp-2-times-ld', false, true, true, 310, 'Lunch and Dinner | Starting from 9 September 2026✅', '2026-11-06', '2026-11-06', 'active', 'Good', 'Starting from 9 September 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-207', 'b0000000-0000-0000-0000-000000000001', 'CUST-207', 'Munzil', '+971 50 3778570', 'munzil@example.ae', 'bld-69', '208', 'mp-2-times-ld', false, true, true, 310, 'No Velleppam | 2 Time Lunch and Dinner, Start From 3th July 2026 cancelling on 25 August Restart on 11 sep', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-208', 'b0000000-0000-0000-0000-000000000001', 'CUST-208', 'Binesh', '+971 50 2824436', 'binesh@example.ae', 'bld-78', '102', 'mp-2-times-bd', true, false, true, 300, '2 Time,Breakfast And Dinner,Start From 23rd July2026', '2026-10-20', '2026-10-20', 'active', 'Good', 'Will pay on 1st week of Nov')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-209', 'b0000000-0000-0000-0000-000000000001', 'CUST-209', 'Shreya', '+971 50 6918813', 'shreya@example.ae', 'bld-79', '105', 'mp-2-times-ld', false, true, true, 310, 'No fish curry and fry  need omlet       Barik rice for lunch instead of motta | Lunch and Dinner Restart from 15 August 2026✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Lunch and Dinner Restart from 15 August 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-210', 'b0000000-0000-0000-0000-000000000001', 'CUST-210', 'Amal', '+971 50 5832666', 'amal@example.ae', 'bld-80', '428', 'mp-1-time-lunch', false, true, false, 186, 'Starting from 15 September 2026✅ dinner start from 21 sep lunch only from oct 4', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Starting from 15 September 2026✅ dinner start from 21 sep lunch only from oct 4')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-211', 'b0000000-0000-0000-0000-000000000001', 'CUST-211', 'Tausif', '+971 50 3797250', 'tausif@example.ae', 'bld-78', 'Flat number 102', 'mp-3-times', true, true, true, 380, '3 times
Starting from 24th Jan 2026  Restart from oct 10 one time 3 times from 13 oct', '2026-08-31', '2026-08-31', 'active', 'Late payer', 'Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-212', 'b0000000-0000-0000-0000-000000000001', 'CUST-212', 'Sujith', '+971 50 1554609', 'sujith@example.ae', 'bld-81', '6', 'mp-2-times-ld', false, true, true, 310, 'Starting from 4 September 2026 ✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-213', 'b0000000-0000-0000-0000-000000000001', 'CUST-213', 'Clins Joseph', '+971 50 3305903', 'clinsjoseph@example.ae', 'bld-81', '6', 'mp-2-times-ld', false, true, true, 310, 'Starting from tomorrow 9 October 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Starting from tomorrow 9 October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-214', 'b0000000-0000-0000-0000-000000000001', 'CUST-214', 'Akshay', '+971 50 7838207', 'akshay@example.ae', 'bld-81', '6', 'mp-2-times-ld', false, true, true, 310, 'Starting from 1 September 2026 ✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-215', 'b0000000-0000-0000-0000-000000000001', 'CUST-215', 'Vishnu', '+971 50 3592983', 'vishnu@example.ae', 'bld-81', '6', 'mp-2-times-ld', false, true, true, 310, 'No beef | Starting from 1 September 2026 ✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-216', 'b0000000-0000-0000-0000-000000000001', 'CUST-216', 'Aslam', '+971 50 8611135', 'aslam@example.ae', 'bld-81', '6', 'mp-2-times-ld', false, true, true, 310, '❗️ No fish curry, need veg curry instead | Starting from 1 September 2026 ✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-217', 'b0000000-0000-0000-0000-000000000001', 'CUST-217', 'Shyam', '+971 50 9303738', 'shyam@example.ae', 'bld-81', '6', 'mp-2-times-ld', false, true, true, 310, 'Starting from 1 September 2026 ✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-218', 'b0000000-0000-0000-0000-000000000001', 'CUST-218', 'Jerin', '+971 50 8793280', 'jerin@example.ae', 'bld-81', '6', 'mp-2-times-ld', false, true, true, 310, '📌No kubboos 📌No pathiri
📌No mandi
Need chapathi instead 
🚨Dinner deliver @ 5PM (early as possible) | Starting from 7 September 2026 ✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-219', 'b0000000-0000-0000-0000-000000000001', 'CUST-219', 'Sarang', '+971 50 4216161', 'sarang@example.ae', 'bld-81', '6', 'mp-2-times-ld', false, true, true, 310, 'Start from 23rd Sep 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Start from 23rd Sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-220', 'b0000000-0000-0000-0000-000000000001', 'CUST-220', 'Sarath', '+971 50 5250166', 'sarath@example.ae', 'bld-82', 'Flat 106', 'mp-2-times-ld', false, true, true, 310, 'Start from 10th Oct 2026✅', '2026-11-09', '2026-11-09', 'active', 'Good', 'Start from 10th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-221', 'b0000000-0000-0000-0000-000000000001', 'CUST-221', 'Soorej', '+971 50 2515362', 'soorej@example.ae', 'bld-83', 'Flat no 204  - P2', 'mp-2-times-ld', false, true, true, 310, 'Lunch & dinner
Starting from 25 Jan 2026 | Deliver inside, Top of refrigerator', '2026-10-30', '2026-10-30', 'active', 'Late payer', 'Lunch & dinner
Starting from 25 Jan 2026 | Deliver inside, Top of refrigerator')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-222', 'b0000000-0000-0000-0000-000000000001', 'CUST-222', 'Jithin', '+971 50 5317798', 'jithin@example.ae', 'bld-84', '201', 'mp-2-times-ld', true, true, false, 310, 'deliver at 5 am | 2 Time (Breakfast and Lunch)', '2026-10-31', '2026-10-31', 'active', 'Good', '2 Time (Breakfast and Lunch)')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-223', 'b0000000-0000-0000-0000-000000000001', 'CUST-223', 'Akash', '+971 50 4204025', 'akash@example.ae', 'bld-85', '201', 'mp-3-times', true, true, true, 380, 'Deliver @ 5:45 AM | Start from 28 Sep 2026✅', '2026-10-27', '2026-10-27', 'active', 'Good', 'Start from 28 Sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-224', 'b0000000-0000-0000-0000-000000000001', 'CUST-224', 'Ansar', '+971 50 1385736', 'ansar@example.ae', 'bld-86', '204', 'mp-1-time-lunch', false, true, false, 186, 'Lunch', '2026-10-31', '2026-10-31', 'active', 'Good', 'Lunch')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-225', 'b0000000-0000-0000-0000-000000000001', 'CUST-225', 'Nafsal', '+971 50 3089621', 'nafsal@example.ae', 'bld-87', '302', 'mp-2-times-bd', true, false, true, 300, '2 Time, Breakfast & dinner only,  2 times from 2nd Aug 2026
Cancelling on 28 october', '2026-09-30', '2026-09-30', 'active', 'Late payer', '2 Time, Breakfast & dinner only,  2 times from 2nd Aug 2026
Cancelling on 28 october')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-226', 'b0000000-0000-0000-0000-000000000001', 'CUST-226', 'Shyam', '+971 50 9109927', 'shyam@example.ae', 'bld-88', '302', 'mp-2-times-ld', false, true, true, 310, '2 Time,Lunch and Dinner', '2026-10-30', '2026-10-30', 'active', 'Late payer', '2 Time,Lunch and Dinner')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-227', 'b0000000-0000-0000-0000-000000000001', 'CUST-227', 'Abin', '+971 50 5725464', 'abin@example.ae', 'bld-88', '302', 'mp-2-times-ld', false, true, true, 310, 'Lunch at 6 am | Starting from 1 September 2026 ✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-228', 'b0000000-0000-0000-0000-000000000001', 'CUST-228', 'Anas', '+971 50 4194325', 'anas@example.ae', 'bld-89', '1', 'mp-3-times', true, true, true, 380, '📍Need to follow the normal menu 📍No machine chapathi 📍No puttu | 3 Time, No machine chapathi , Need handmade chapathi only, or any other alternative', '2026-10-31', '2026-10-31', 'active', 'Good', '3 Time, No machine chapathi , Need handmade chapathi only, or any other alternative')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-229', 'b0000000-0000-0000-0000-000000000001', 'CUST-229', 'Sharafu', '+971 50 8882859', 'sharafu@example.ae', 'bld-89', '1', 'mp-3-times', true, true, true, 380, '📍Need to follow the normal menu
📍No machine chapathi 
📍No puttu | Starting from 1 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-230', 'b0000000-0000-0000-0000-000000000001', 'CUST-230', 'Thamjeed', '+971 50 2755941', 'thamjeed@example.ae', 'bld-89', '', 'mp-2-times-bd', true, false, true, 300, 'Start from 6th Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Start from 6th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-231', 'b0000000-0000-0000-0000-000000000001', 'CUST-231', 'Praveen', '+971 50 9544980', 'praveen@example.ae', 'bld-90', '501', 'mp-1-time-lunch', false, true, false, 186, '1 Time , Lunch Only', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-232', 'b0000000-0000-0000-0000-000000000001', 'CUST-232', 'Farzin', '+971 50 9586742', 'farzin@example.ae', 'bld-91', '103', 'mp-1-time-dinner', false, false, true, 150, 'Start from today 30 sep 2026✅', '2026-10-29', '2026-10-29', 'active', 'Good', 'Start from today 30 sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-233', 'b0000000-0000-0000-0000-000000000001', 'CUST-233', 'Midhun', '+971 50 1732743', 'midhun@example.ae', 'bld-86', '204', 'mp-1-time-lunch', false, true, false, 186, '2 Time , Lunch and Dinner one time from sep 1', '2026-10-31', '2026-10-31', 'active', 'Good', '2 Time , Lunch and Dinner one time from sep 1')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-234', 'b0000000-0000-0000-0000-000000000001', 'CUST-234', 'Aiju', '+971 50 9054655', 'aiju@example.ae', 'bld-89', '1', 'mp-3-times', true, true, true, 380, 'Need Hand made chapathi | 3 Time', '2026-10-31', '2026-10-31', 'active', 'Good', '3 Time')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-235', 'b0000000-0000-0000-0000-000000000001', 'CUST-235', 'Akhil', '+971 50 2906297', 'akhil@example.ae', 'bld-92', 'Room #2, Ground floor', 'mp-2-times-ld', false, true, true, 310, 'Lunch & dinner
Start from 11th June 2026✅ | Please deliver inside | Cancelling on 22th Oct 2026❌', '2026-09-30', '2026-09-30', 'active', 'Good', 'Lunch & dinner
Start from 11th June 2026✅ | Please deliver inside | Cancelling on 22th Oct 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-236', 'b0000000-0000-0000-0000-000000000001', 'CUST-236', 'Niyas', '+971 50 6888701', 'niyas@example.ae', 'bld-85', '201', 'mp-3-times', true, true, true, 380, 'Starting from 1 September 2026 ✅', '2026-10-30', '2026-10-30', 'active', 'Good', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-237', 'b0000000-0000-0000-0000-000000000001', 'CUST-237', 'Sanjay', '+971 50 5988743', 'sanjay@example.ae', 'bld-93', '101', 'mp-2-times-ld', false, true, true, 310, 'Deliver at 5:30 | Starting from tomorrow 6 October 2026✅', '2026-11-05', '2026-11-05', 'active', 'Good', 'Starting from tomorrow 6 October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-238', 'b0000000-0000-0000-0000-000000000001', 'CUST-238', 'Shamil', '+971 50 6377889', 'shamil@example.ae', 'bld-89', '', 'mp-2-times-bd', true, false, true, 300, 'Start from 6th Oct 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Start from 6th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-239', 'b0000000-0000-0000-0000-000000000001', 'CUST-239', 'Vishnu', '+971 50 4886164', 'vishnu@example.ae', 'bld-94', '304', 'mp-2-times-ld', false, true, true, 310, 'No normal meals - Need chapathi set insted Special items are fine | 3 times
No normal meals - Need chapathi set instead
Special items are fine
Start from 15 June 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-240', 'b0000000-0000-0000-0000-000000000001', 'CUST-240', 'Mubarak', '+971 50 5809455', 'mubarak@example.ae', 'bld-89', '1', 'mp-3-times', true, true, true, 380, 'No pathiri No put ,Need Hand made chapathi | 3 Time  ,Start from 1stJuly 2026, No pathiri
No put', '2026-10-31', '2026-10-31', 'active', 'Good', '3 Time  ,Start from 1stJuly 2026, No pathiri
No put')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-241', 'b0000000-0000-0000-0000-000000000001', 'CUST-241', 'Sreenitha', '+971 50 6204729', 'sreenitha@example.ae', 'bld-95', '101', 'mp-1-time-lunch', false, true, false, 186, 'Chapathi set only from Monday to Saturday | Sunday biriyani needed | No soya beans | No cabbage | Starting from 2 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 2 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-242', 'b0000000-0000-0000-0000-000000000001', 'CUST-242', 'Akeel', '+971 50 9880815', 'akeel@example.ae', 'bld-96', '203', 'mp-2-times-ld', false, true, true, 310, 'Lunch Barik Rice | 2 Time, Lunch and Dinner, Lunch Barik RiceStart From 30thJuly2026', '2026-09-30', '2026-09-30', 'active', 'Late payer', '2 Time, Lunch and Dinner, Lunch Barik RiceStart From 30thJuly2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-243', 'b0000000-0000-0000-0000-000000000001', 'CUST-243', 'Heaven', '+971 50 2053536', 'heaven@example.ae', 'bld-84', '201', 'mp-2-times-ld', false, true, true, 310, '2 Time, Lunch and DinnerStart From 1st July2026', '2026-09-30', '2026-09-30', 'active', 'Good', '2 Time, Lunch and DinnerStart From 1st July2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-244', 'b0000000-0000-0000-0000-000000000001', 'CUST-244', 'Niraimathi', '+971 50 8285018', 'niraimathi@example.ae', 'bld-97', '306', 'mp-2-times-ld', false, true, true, 310, 'Barik rice only No beef - Need chicken instead 
No fish - Need egg instead 
No Velappam
No NicePathiri | 2 Time, Lunch and Dinner,Lunch Barik Rice,No Beef ,No Fish,Start From 1st July2026', '2026-10-31', '2026-10-31', 'active', 'Good', '2 Time, Lunch and Dinner,Lunch Barik Rice,No Beef ,No Fish,Start From 1st July2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-245', 'b0000000-0000-0000-0000-000000000001', 'CUST-245', 'Shyamjith', '+971 50 5960271', 'shyamjith@example.ae', 'bld-97', '302', 'mp-2-times-ld', false, true, true, 310, 'No fish fry. Fish curry is fine                                                                  Lunch @ noon - Deliver at the office: IDS BUILDING 
M FLOOR OFFICE NUMBER M01 | Start from 20th Oct 2026✅', '2026-11-18', '2026-11-18', 'active', 'Good', 'Start from 20th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-246', 'b0000000-0000-0000-0000-000000000001', 'CUST-246', 'Christina', '+971 50 4416611', 'christina@example.ae', 'bld-98', '8', 'mp-1-time-dinner', false, false, true, 150, 'Starting from 2 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 2 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-247', 'b0000000-0000-0000-0000-000000000001', 'CUST-247', 'Muthasim', '+971 50 4415258', 'muthasim@example.ae', 'bld-99', '101', 'mp-3-times', true, true, true, 380, 'Lunch Barik,No Fish No putt | 3 Times,Lunch Barik,No Fish Restarting from 1 October 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', '3 Times,Lunch Barik,No Fish Restarting from 1 October 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-248', 'b0000000-0000-0000-0000-000000000001', 'CUST-248', 'Yamuna', '+971 50 7965917', 'yamuna@example.ae', 'bld-98', '8', 'mp-2-times-ld', false, true, true, 310, 'Cancel on 30th Oct 2026 ❌ | Starting from 13 September 2026 ✅', '2026-10-30', '2026-10-30', 'paused', 'Good', 'Starting from 13 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-249', 'b0000000-0000-0000-0000-000000000001', 'CUST-249', 'Sanjana', '+971 50 5203349', 'sanjana@example.ae', 'bld-100', '8', 'mp-2-times-ld', false, true, true, 310, 'Cancel on 24 Oct 2026 ❌ | Starting from 24 September 2026✅', '2026-10-23', '2026-10-23', 'paused', 'Good', 'Starting from 24 September 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-250', 'b0000000-0000-0000-0000-000000000001', 'CUST-250', 'Delna', '+971 50 9610573', 'delna@example.ae', 'bld-100', '8', 'mp-1-time-dinner', false, false, true, 150, 'Start from 1st Oct 2026✅', '2026-10-30', '2026-10-30', 'active', 'Good', 'Start from 1st Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-251', 'b0000000-0000-0000-0000-000000000001', 'CUST-251', 'Sona', '+971 50 7913777', 'sona@example.ae', 'bld-100', '8', 'mp-2-times-ld', false, true, true, 310, 'Start from 15th Oct 2026✅ Cancel on 31st Oct 2026❌', '2026-09-01', '2026-10-01', 'active', 'Good', 'Start from 15th Oct 2026✅ Cancel on 31st Oct 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-252', 'b0000000-0000-0000-0000-000000000001', 'CUST-252', 'Thanveer', '+971 50 7541103', 'thanveer@example.ae', 'bld-101', '16', 'mp-2-times-ld', false, true, true, 310, 'Start from 6th Oct 2026✅', '2026-11-04', '2026-11-04', 'active', 'Good', 'Start from 6th Oct 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-253', 'b0000000-0000-0000-0000-000000000001', 'CUST-253', 'Abhinand', '+971 50 6583875', 'abhinand@example.ae', 'bld-84', '201', 'mp-2-times-ld', false, true, true, 310, '2 Time, Lunch and DinnerStart From 2nd July2026', '2026-09-30', '2026-09-30', 'active', 'Bad', '2 Time, Lunch and DinnerStart From 2nd July2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-254', 'b0000000-0000-0000-0000-000000000001', 'CUST-254', 'Sebastian', '+971 50 3008141', 'sebastian@example.ae', 'bld-87', '302', 'mp-2-times-bd', true, false, true, 300, 'Starting from 2 September 2026 ✅', '2026-10-01', '2026-10-01', 'active', 'Good', 'Starting from 2 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-255', 'b0000000-0000-0000-0000-000000000001', 'CUST-255', 'Aiswariya', '+971 50 1292373', 'aiswariya@example.ae', 'bld-102', '303', 'mp-2-times-ld', true, true, false, 310, '3 times, start from 4th July 2026 2 times from 1 september', '2026-09-30', '2026-09-30', 'active', 'Bad', '3 times, start from 4th July 2026 2 times from 1 september')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-256', 'b0000000-0000-0000-0000-000000000001', 'CUST-256', 'Aathira', '+971 50 9133932', 'aathira@example.ae', 'bld-102', '203', 'mp-1-time-lunch', false, true, false, 186, 'Starting from 1 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-257', 'b0000000-0000-0000-0000-000000000001', 'CUST-257', 'Anson', '+971 50 5685561', 'anson@example.ae', 'bld-103', '218', 'mp-1-time-lunch', false, true, false, 186, 'Deliver @ 6:30 AM
Start from 3rd Aug 2026✅ Lunch only from 7th Oct', '2026-10-31', '2026-10-31', 'active', 'Good', 'Deliver @ 6:30 AM
Start from 3rd Aug 2026✅ Lunch only from 7th Oct')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-258', 'b0000000-0000-0000-0000-000000000001', 'CUST-258', 'Abdul', '+971 50 3403399', 'abdul@example.ae', 'bld-104', '6', 'mp-2-times-ld', false, true, true, 310, 'Barik rice, Lunch @ noon | Lunch and dinner, Barik rice, Lunch @ noon,                               Start from 1st Aug 2026✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Lunch and dinner, Barik rice, Lunch @ noon,                               Start from 1st Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-259', 'b0000000-0000-0000-0000-000000000001', 'CUST-259', 'Megha K', '+971 50 8988441', 'meghak@example.ae', 'bld-105', '103', 'mp-2-times-ld', false, true, true, 310, 'Starting from tomorrow 9 October 2026✅', '2026-11-07', '2026-11-07', 'active', 'Good', 'Starting from tomorrow 9 October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-260', 'b0000000-0000-0000-0000-000000000001', 'CUST-260', 'Aathira', '+971 50 8710184', 'aathira@example.ae', 'bld-106', '201', 'mp-2-times-ld', false, true, true, 310, 'Lunch  & Dinner No Fish items | Lunch  & Dinner | Start from 7th Aug 2026✅ Cancelling on 5 November', '2026-10-31', '2026-10-31', 'active', 'Good', 'Lunch  & Dinner | Start from 7th Aug 2026✅ Cancelling on 5 November')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-261', 'b0000000-0000-0000-0000-000000000001', 'CUST-261', 'Ardra', '+971 50 5176658', 'ardra@example.ae', 'bld-107', '', 'mp-1-time-dinner', false, false, true, 150, 'Handmade chapathi pure veg | Dinner only                                                                                         Handmade chapathi only Start from 17 August 2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'Dinner only                                                                                         Handmade chapathi only Start from 17 August 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-262', 'b0000000-0000-0000-0000-000000000001', 'CUST-262', 'Nithyesh', '+971 50 4427713', 'nithyesh@example.ae', 'bld-108', '5', 'mp-1-time-lunch', false, true, false, 186, 'Starting from 1 September 2026 ✅', '2026-09-30', '2026-09-30', 'active', 'Late payer', 'Starting from 1 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-263', 'b0000000-0000-0000-0000-000000000001', 'CUST-263', 'Bazith', '+971 50 8522616', 'bazith@example.ae', 'bld-109', '16', 'mp-2-times-ld', false, true, true, 310, '📌Please deliver inside the flat 📌Lunch: Chapati set only instead of normal meals. Special items are fine | Lunch & Dinner   Deliver before 7 AM  Start from 20th Aug 2026✅ | 📌Please deliver inside the flat', '2026-10-25', '2026-10-25', 'active', 'Late payer', 'Lunch & Dinner   Deliver before 7 AM  Start from 20th Aug 2026✅ | 📌Please deliver inside the flat')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-264', 'b0000000-0000-0000-0000-000000000001', 'CUST-264', 'Dhanya', '+971 50 7326045', 'dhanya@example.ae', 'bld-106', '201', 'mp-1-time-bf', true, false, false, 120, 'starting from  12 October  2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'starting from  12 October  2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-265', 'b0000000-0000-0000-0000-000000000001', 'CUST-265', 'Treesa', '+971 50 1979270', 'treesa@example.ae', 'bld-106', '201', 'mp-2-times-ld', false, true, true, 310, 'starting from 12 October  2026✅', '2026-09-01', '2026-10-01', 'active', 'Late payer', 'starting from 12 October  2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-266', 'b0000000-0000-0000-0000-000000000001', 'CUST-266', 'Sini', '+971 50 4117797', 'sini@example.ae', 'bld-110', '', 'mp-1-time-dinner', false, false, true, 150, 'Start from 21st Sep 2026✅ Dinner only from 12 oct', '2026-10-14', '2026-10-14', 'active', 'Good', 'Start from 21st Sep 2026✅ Dinner only from 12 oct')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-267', 'b0000000-0000-0000-0000-000000000001', 'CUST-267', 'Harikrishnan', '+971 50 8012346', 'harikrishnan@example.ae', 'bld-111', '302', 'mp-2-times-ld', false, true, true, 310, 'Start from 21st Sep 2026✅', '2026-10-30', '2026-10-30', 'active', 'Good', 'Start from 21st Sep 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-268', 'b0000000-0000-0000-0000-000000000001', 'CUST-268', 'Shiva', '+971 50 3368032', 'shiva@example.ae', 'bld-112', '205', 'mp-2-times-ld', false, true, true, 310, 'No porotta | Starting from 16 September 2026 ✅', '2026-10-31', '2026-10-31', 'active', 'Good', 'Starting from 16 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-269', 'b0000000-0000-0000-0000-000000000001', 'CUST-269', 'Starting Date', '+971 50 1606292', 'startingdate@example.ae', 'bld-113', '', 'mp-3-times', true, true, true, 380, 'Number Of Days | Times Of Food | Deduction Amount | Final Charges', '2026-07-01', '2026-07-01', 'left', 'Good', 'Number Of Days | Times Of Food | Deduction Amount | Final Charges')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-270', 'b0000000-0000-0000-0000-000000000001', 'CUST-270', '2026-10-19', '+971 50 5940235', '20261019@example.ae', 'bld-113', '', 'mp-3-times', true, true, true, 380, '13 | 2 | 130', '2026-07-01', '2026-07-01', 'left', 'Late payer', '13 | 2 | 130')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-271', 'b0000000-0000-0000-0000-000000000001', 'CUST-271', '2026-10-22', '+971 50 4140400', '20261022@example.ae', 'bld-113', '', 'mp-3-times', true, true, true, 380, '10 | 3 | 130', '2026-07-01', '2026-07-01', 'left', 'Late payer', '10 | 3 | 130')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-272', 'b0000000-0000-0000-0000-000000000001', 'CUST-272', 'Ashnaf', '+971 50 4225518', 'ashnaf@example.ae', 'bld-114', '26', 'mp-3-times', true, true, true, 380, '1 | 1 | Lunch & dinner | 0 | -1', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | Lunch & dinner | 0 | -1')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-273', 'b0000000-0000-0000-0000-000000000001', 'CUST-273', 'Liju', '+971 50 4865570', 'liju@example.ae', 'bld-115', '404', 'mp-3-times', true, true, true, 380, '1 | 0 | 2 Time ,Breakfast and Lunch ,Delivery 5.45 Am | 0 | -70', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2 Time ,Breakfast and Lunch ,Delivery 5.45 Am | 0 | -70')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-274', 'b0000000-0000-0000-0000-000000000001', 'CUST-274', 'Nissam', '+971 50 2807625', 'nissam@example.ae', 'bld-116', '204', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch And Dinner, Delivery inside Kitchen', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch And Dinner, Delivery inside Kitchen')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-275', 'b0000000-0000-0000-0000-000000000001', 'CUST-275', 'Raji', '+971 50 2297663', 'raji@example.ae', 'bld-117', '205', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time , Lunch and Dinner, Lunch 12 Pm', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time , Lunch and Dinner, Lunch 12 Pm')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-276', 'b0000000-0000-0000-0000-000000000001', 'CUST-276', 'Pintu', '+971 50 3401732', 'pintu@example.ae', 'bld-118', '12', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time ,Deliver @ 6.00 Am | 52', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time ,Deliver @ 6.00 Am | 52')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-277', 'b0000000-0000-0000-0000-000000000001', 'CUST-277', 'Helbin', '+971 50 9393105', 'helbin@example.ae', 'bld-119', '48/6', 'mp-3-times', true, true, true, 380, '1 | 0 | 1 Time Lunch Only ,Start from 1st July 2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 1 Time Lunch Only ,Start from 1st July 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-278', 'b0000000-0000-0000-0000-000000000001', 'CUST-278', 'Alfa', '+971 50 9196056', 'alfa@example.ae', 'bld-120', '301', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time ,Lunch and Dinner,Start from 7th July2026 | 10', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time ,Lunch and Dinner,Start from 7th July2026 | 10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-279', 'b0000000-0000-0000-0000-000000000001', 'CUST-279', 'Shahina', '+971 50 7069869', 'shahina@example.ae', 'bld-121', '306', 'mp-3-times', true, true, true, 380, '2 time', '2026-07-01', '2026-07-01', 'left', 'Good', '2 time')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-280', 'b0000000-0000-0000-0000-000000000001', 'CUST-280', 'Sajad', '+971 50 4105960', 'sajad@example.ae', 'bld-122', '101', 'mp-3-times', true, true, true, 380, '3 time', '2026-07-01', '2026-07-01', 'left', 'Good', '3 time')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-281', 'b0000000-0000-0000-0000-000000000001', 'CUST-281', 'Binoy', '+971 50 3708308', 'binoy@example.ae', 'bld-123', '104', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-282', 'b0000000-0000-0000-0000-000000000001', 'CUST-282', 'Smitta', '+971 50 9783287', 'smitta@example.ae', 'bld-123', '207', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-283', 'b0000000-0000-0000-0000-000000000001', 'CUST-283', 'Nithya', '+971 50 6863243', 'nithya@example.ae', 'bld-124', '4', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-284', 'b0000000-0000-0000-0000-000000000001', 'CUST-284', 'Ansaf', '+971 50 8064437', 'ansaf@example.ae', 'bld-125', '205', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-285', 'b0000000-0000-0000-0000-000000000001', 'CUST-285', 'Kapil', '+971 50 5178291', 'kapil@example.ae', 'bld-126', '310', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-286', 'b0000000-0000-0000-0000-000000000001', 'CUST-286', 'Safwan', '+971 50 7563776', 'safwan@example.ae', 'bld-127', '205', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-287', 'b0000000-0000-0000-0000-000000000001', 'CUST-287', 'Faraaz', '+971 50 8746843', 'faraaz@example.ae', 'bld-128', '23', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-288', 'b0000000-0000-0000-0000-000000000001', 'CUST-288', 'Christo', '+971 50 2397026', 'christo@example.ae', 'bld-116', '201', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-289', 'b0000000-0000-0000-0000-000000000001', 'CUST-289', 'Marjana', '+971 50 8060369', 'marjana@example.ae', 'bld-129', '215', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-290', 'b0000000-0000-0000-0000-000000000001', 'CUST-290', 'Abhilash', '+971 50 7984764', 'abhilash@example.ae', 'bld-130', '206', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-291', 'b0000000-0000-0000-0000-000000000001', 'CUST-291', 'Arjun', '+971 50 5527149', 'arjun@example.ae', 'bld-131', '304', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-292', 'b0000000-0000-0000-0000-000000000001', 'CUST-292', 'Mini', '+971 50 5846089', 'mini@example.ae', 'bld-132', '520', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-293', 'b0000000-0000-0000-0000-000000000001', 'CUST-293', 'Vinod', '+971 50 2580128', 'vinod@example.ae', 'bld-133', '201', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-294', 'b0000000-0000-0000-0000-000000000001', 'CUST-294', 'Sanakesh', '+971 50 6081289', 'sanakesh@example.ae', 'bld-133', '201', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-295', 'b0000000-0000-0000-0000-000000000001', 'CUST-295', 'Christy', '+971 50 5772052', 'christy@example.ae', 'bld-134', '26', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-296', 'b0000000-0000-0000-0000-000000000001', 'CUST-296', 'Ajju', '+971 50 7103274', 'ajju@example.ae', 'bld-135', '1', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-297', 'b0000000-0000-0000-0000-000000000001', 'CUST-297', 'Santhosh', '+971 50 7946445', 'santhosh@example.ae', 'bld-136', '1', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-298', 'b0000000-0000-0000-0000-000000000001', 'CUST-298', 'Sandra', '+971 50 1183778', 'sandra@example.ae', 'bld-137', '104', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-299', 'b0000000-0000-0000-0000-000000000001', 'CUST-299', 'Jebi', '+971 50 3224550', 'jebi@example.ae', 'bld-138', '201', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-300', 'b0000000-0000-0000-0000-000000000001', 'CUST-300', 'Sharon', '+971 50 2092904', 'sharon@example.ae', 'bld-139', '206', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-301', 'b0000000-0000-0000-0000-000000000001', 'CUST-301', 'Siyad', '+971 50 4648056', 'siyad@example.ae', 'bld-140', '302', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-302', 'b0000000-0000-0000-0000-000000000001', 'CUST-302', 'Hijas', '+971 50 3695066', 'hijas@example.ae', 'bld-141', '609', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-303', 'b0000000-0000-0000-0000-000000000001', 'CUST-303', 'Thahir', '+971 50 3123218', 'thahir@example.ae', 'bld-142', 'SS1', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-304', 'b0000000-0000-0000-0000-000000000001', 'CUST-304', 'Ali', '+971 50 6751159', 'ali@example.ae', 'bld-143', '12', 'mp-3-times', true, true, true, 380, 'Historical / Left', '2026-07-01', '2026-07-01', 'left', 'Good', 'Account closed / Cancelled')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-305', 'b0000000-0000-0000-0000-000000000001', 'CUST-305', 'Jaison', '+971 50 4983364', 'jaison@example.ae', 'bld-144', '203', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time ,Deliver @ 6.Am', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time ,Deliver @ 6.Am')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-306', 'b0000000-0000-0000-0000-000000000001', 'CUST-306', 'Mubsina', '+971 50 5926052', 'mubsina@example.ae', 'bld-145', '307', 'mp-3-times', true, true, true, 380, '1 | 0 | 2 Time ,Breakfast and Lunch', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2 Time ,Breakfast and Lunch')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-307', 'b0000000-0000-0000-0000-000000000001', 'CUST-307', 'Faju', '+971 50 9818463', 'faju@example.ae', 'bld-146', '7', 'mp-3-times', true, true, true, 380, '1 | 0 | Lunch only | 230', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | Lunch only | 230')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-308', 'b0000000-0000-0000-0000-000000000001', 'CUST-308', 'Vineeth', '+971 50 2457760', 'vineeth@example.ae', 'bld-130', '102', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and Dinner,Deliver @6.00AmStart From 28th June2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and Dinner,Deliver @6.00AmStart From 28th June2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-309', 'b0000000-0000-0000-0000-000000000001', 'CUST-309', 'Aflah', '+971 50 1256971', 'aflah@example.ae', 'bld-147', '105', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time Lunch and Dinner, Lunch 12 PmStart From 3th July02026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time Lunch and Dinner, Lunch 12 PmStart From 3th July02026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-310', 'b0000000-0000-0000-0000-000000000001', 'CUST-310', 'Sreelakshmi', '+971 50 8540860', 'sreelakshmi@example.ae', 'bld-148', '103', 'mp-3-times', true, true, true, 380, '1 | 0 | 1 Time ,Lunch Only', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 1 Time ,Lunch Only')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-311', 'b0000000-0000-0000-0000-000000000001', 'CUST-311', 'Amalraj', '+971 50 4716896', 'amalraj@example.ae', 'bld-149', '15', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,Start from 9th July 2026,7580#', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,Start from 9th July 2026,7580#')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-312', 'b0000000-0000-0000-0000-000000000001', 'CUST-312', 'Martin', '+971 50 9018100', 'martin@example.ae', 'bld-150', '305', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time , Lunch 12 Pm | 13', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time , Lunch 12 Pm | 13')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-313', 'b0000000-0000-0000-0000-000000000001', 'CUST-313', 'Shujah', '+971 50 2006151', 'shujah@example.ae', 'bld-151', '28', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time , Lunch and Dinner ,Morning Delivery @ 5.45', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time , Lunch and Dinner ,Morning Delivery @ 5.45')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-314', 'b0000000-0000-0000-0000-000000000001', 'CUST-314', 'Swathy', '+971 50 3862192', 'swathy@example.ae', 'bld-152', '301', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and DinnerStart From 5th July2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and DinnerStart From 5th July2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-315', 'b0000000-0000-0000-0000-000000000001', 'CUST-315', 'Fathima', '+971 50 1905899', 'fathima@example.ae', 'bld-153', '43/3', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,Restart From 7th July 2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,Restart From 7th July 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-316', 'b0000000-0000-0000-0000-000000000001', 'CUST-316', 'Haleema', '+971 50 3374502', 'haleema@example.ae', 'bld-154', '404', 'mp-3-times', true, true, true, 380, '1 | 0 | 2Time,Breakfast and Lunch,No Mandhi,No Ghee rice,No Biriyani,NoBeef,No Fish,Deliver 6.45 Am,Start From 8th July 2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2Time,Breakfast and Lunch,No Mandhi,No Ghee rice,No Biriyani,NoBeef,No Fish,Deliver 6.45 Am,Start From 8th July 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-317', 'b0000000-0000-0000-0000-000000000001', 'CUST-317', 'Vineetha', '+971 50 7769708', 'vineetha@example.ae', 'bld-155', '305', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,No Beef,Start from 9th July 2026,', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,No Beef,Start from 9th July 2026,')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-318', 'b0000000-0000-0000-0000-000000000001', 'CUST-318', 'Ankita', '+971 50 3817289', 'ankita@example.ae', 'bld-156', '402', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch and Dinner ,Lunch 12 Pm,Start from 10th 2026,Cancelling on 15th July X', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch and Dinner ,Lunch 12 Pm,Start from 10th 2026,Cancelling on 15th July X')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-319', 'b0000000-0000-0000-0000-000000000001', 'CUST-319', 'Makbool', '+971 50 9370281', 'makbool@example.ae', 'bld-157', '35/5    and 301', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time ,Breakfast and Dinner Sheikh Mariyam Building and Lunch 12 Pm Atlas Building 301,No Fish Item', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time ,Breakfast and Dinner Sheikh Mariyam Building and Lunch 12 Pm Atlas Building 301,No Fish Item')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-320', 'b0000000-0000-0000-0000-000000000001', 'CUST-320', 'Alwin', '+971 50 2931412', 'alwin@example.ae', 'bld-158', '202', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,Lunch 12 pm ,Start From 5th July02026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,Lunch 12 pm ,Start From 5th July02026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-321', 'b0000000-0000-0000-0000-000000000001', 'CUST-321', 'Rinta', '+971 50 2282942', 'rinta@example.ae', 'bld-159', '106', 'mp-3-times', true, true, true, 380, '1 | 0 | 1 Time Lunch Only,Monday to Thursday,Start From 20th July2026 | 6', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 1 Time Lunch Only,Monday to Thursday,Start From 20th July2026 | 6')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-322', 'b0000000-0000-0000-0000-000000000001', 'CUST-322', 'Shahnad', '+971 50 1361082', 'shahnad@example.ae', 'bld-160', '110', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time ,Delivery 5.30 Am | 0 | -20', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time ,Delivery 5.30 Am | 0 | -20')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-323', 'b0000000-0000-0000-0000-000000000001', 'CUST-323', 'Suni co Jithin', '+971 50 4796078', 'sunicojithin@example.ae', 'bld-161', '201', 'mp-3-times', true, true, true, 380, '1 | 0 | 2 Time Breakfast and Lunch ,No Beef,Start from 8th July 2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2 Time Breakfast and Lunch ,No Beef,Start from 8th July 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-324', 'b0000000-0000-0000-0000-000000000001', 'CUST-324', 'Ajnas', '+971 50 5338840', 'ajnas@example.ae', 'bld-162', '303', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time ,Lunch and Dinner | 225 DHS RECEIEVD', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time ,Lunch and Dinner | 225 DHS RECEIEVD')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-325', 'b0000000-0000-0000-0000-000000000001', 'CUST-325', 'Rmshad', '+971 50 9673526', 'rmshad@example.ae', 'bld-163', 'Shop', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time , Lunch and Dinner,Lunch 12 Pm | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time , Lunch and Dinner,Lunch 12 Pm | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-326', 'b0000000-0000-0000-0000-000000000001', 'CUST-326', 'Rasheed', '+971 50 9528176', 'rasheed@example.ae', 'bld-164', '', 'mp-3-times', true, true, true, 380, '1 | 1 | Lunch & dinner
Lunch @ noon ( Deliver as late as possible)
Start from 18 June 2026✅', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | Lunch & dinner
Lunch @ noon ( Deliver as late as possible)
Start from 18 June 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-327', 'b0000000-0000-0000-0000-000000000001', 'CUST-327', 'Pavan', '+971 50 6513798', 'pavan@example.ae', 'bld-165', '310', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch And Dinner,No Beef,Start From 14th July2026 | 110DHS  RECEIEVD, 27/07/2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch And Dinner,No Beef,Start From 14th July2026 | 110DHS  RECEIEVD, 27/07/2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-328', 'b0000000-0000-0000-0000-000000000001', 'CUST-328', 'Pavan(Anusha)', '+971 50 8261512', 'pavananusha@example.ae', 'bld-165', '310', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch And Dinner,N Beef,Start From 14th July2026 | 110DHS  RECEIEVD, 27/07/2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch And Dinner,N Beef,Start From 14th July2026 | 110DHS  RECEIEVD, 27/07/2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-329', 'b0000000-0000-0000-0000-000000000001', 'CUST-329', 'Alan', '+971 50 5146497', 'alan@example.ae', 'bld-166', '323', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time , From 11th July 2026, Cancelled on 28th July 2026 XXX | 234 DHS', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time , From 11th July 2026, Cancelled on 28th July 2026 XXX | 234 DHS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-330', 'b0000000-0000-0000-0000-000000000001', 'CUST-330', 'Brilla', '+971 50 1954972', 'brilla@example.ae', 'bld-167', '601', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch and Dinner,Start From 29th June 2026,                                       Cancelled XXX', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch and Dinner,Start From 29th June 2026,                                       Cancelled XXX')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-331', 'b0000000-0000-0000-0000-000000000001', 'CUST-331', 'Grincy', '+971 50 8167896', 'grincy@example.ae', 'bld-168', '', 'mp-3-times', true, true, true, 380, '20', '2026-07-01', '2026-07-01', 'left', 'Good', '20')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-332', 'b0000000-0000-0000-0000-000000000001', 'CUST-332', 'Lal', '+971 50 3530036', 'lal@example.ae', 'bld-169', '201', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,Breakfast &Dinner 4 Pcs, Cancelled❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,Breakfast &Dinner 4 Pcs, Cancelled❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-333', 'b0000000-0000-0000-0000-000000000001', 'CUST-333', 'Ajith', '+971 50 9707114', 'ajith@example.ae', 'bld-115', '404', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch cp veg,Dinner,  Cancelling on 31st July 2026❌ | 290 Dhs | 10', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch cp veg,Dinner,  Cancelling on 31st July 2026❌ | 290 Dhs | 10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-334', 'b0000000-0000-0000-0000-000000000001', 'CUST-334', 'Ziyad', '+971 50 7509107', 'ziyad@example.ae', 'bld-170', '202', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time, Cancelled XXX | 380 | 2026-07-31 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time, Cancelled XXX | 380 | 2026-07-31 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-335', 'b0000000-0000-0000-0000-000000000001', 'CUST-335', 'Arathy', '+971 50 7225491', 'arathy@example.ae', 'bld-171', '405', 'mp-3-times', true, true, true, 380, '1 | 0 | 2 Time , Breakfast and Lunch,No Beef,Lunch chappathi set, Cancelling on 30th July 2026  XXX | 90 DHS', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2 Time , Breakfast and Lunch,No Beef,Lunch chappathi set, Cancelling on 30th July 2026  XXX | 90 DHS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-336', 'b0000000-0000-0000-0000-000000000001', 'CUST-336', 'Megha', '+971 50 3629655', 'megha@example.ae', 'bld-171', '405', 'mp-3-times', true, true, true, 380, '1 | 0 | 2 Time , Lunch and Dinner,No Fish ,No Beef, Cancelling on 30th July 2026   XXX | 90DHS', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2 Time , Lunch and Dinner,No Fish ,No Beef, Cancelling on 30th July 2026   XXX | 90DHS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-337', 'b0000000-0000-0000-0000-000000000001', 'CUST-337', 'Saranya', '+971 50 7084063', 'saranya@example.ae', 'bld-171', '405', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 times
Start from 14th June 2026✅,Lunch chappathi Cancelling on 31st July❌ | 180 DHS', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 times
Start from 14th June 2026✅,Lunch chappathi Cancelling on 31st July❌ | 180 DHS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-338', 'b0000000-0000-0000-0000-000000000001', 'CUST-338', 'Ananthu', '+971 50 2364860', 'ananthu@example.ae', 'bld-172', '203', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 times,  
Deliver @ 5:45 AM
Start from 14th June 2026✅,Cancelled  XXX | 31/7/2026 | 609', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 times,  
Deliver @ 5:45 AM
Start from 14th June 2026✅,Cancelled  XXX | 31/7/2026 | 609')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-339', 'b0000000-0000-0000-0000-000000000001', 'CUST-339', 'Azhar', '+971 50 5121179', 'azhar@example.ae', 'bld-172', '203', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 times
Deliver @ 5:45 AM
Start from 15th June 2026✅,Cancelled  XXX | 31/7/2026 | 595', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 times
Deliver @ 5:45 AM
Start from 15th June 2026✅,Cancelled  XXX | 31/7/2026 | 595')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-340', 'b0000000-0000-0000-0000-000000000001', 'CUST-340', 'Abdulla', '+971 50 9256398', 'abdulla@example.ae', 'bld-173', 'G26  -  room', 'mp-3-times', true, true, true, 380, '0 | 1 | Breakfast & dinner, 
4845#
Start from 16th June 2026✅Cancelling on 31st July 2026❌ | 300 Dhs | 2026-07-31 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | Breakfast & dinner, 
4845#
Start from 16th June 2026✅Cancelling on 31st July 2026❌ | 300 Dhs | 2026-07-31 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-341', 'b0000000-0000-0000-0000-000000000001', 'CUST-341', 'Sonali', '+971 50 4721905', 'sonali@example.ae', 'bld-174', '108', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time ,Deliver @ 6.00 Am | Cancelled ❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time ,Deliver @ 6.00 Am | Cancelled ❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-342', 'b0000000-0000-0000-0000-000000000001', 'CUST-342', 'Shelmi', '+971 50 5661154', 'shelmi@example.ae', 'bld-175', '1', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time Lunch and Dinner,  
Cancelling on 31st July 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time Lunch and Dinner,  
Cancelling on 31st July 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-343', 'b0000000-0000-0000-0000-000000000001', 'CUST-343', 'Afsal', '+971 50 6095472', 'afsal@example.ae', 'bld-176', '217', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and Dinner,Lunch 12 PmStart From 1st July2026, Cancelling today, 31  July 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and Dinner,Lunch 12 PmStart From 1st July2026, Cancelling today, 31  July 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-344', 'b0000000-0000-0000-0000-000000000001', 'CUST-344', 'Lineesh', '+971 50 9843063', 'lineesh@example.ae', 'bld-177', '304', 'mp-3-times', true, true, true, 380, '1 | 0 | 1 Time Lunch Only ,Start From 29th June 2026,                              Cancelling on 31st July 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 1 Time Lunch Only ,Start From 29th June 2026,                              Cancelling on 31st July 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-345', 'b0000000-0000-0000-0000-000000000001', 'CUST-345', 'Jafer', '+971 50 2615304', 'jafer@example.ae', 'bld-178', '23', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and Dinner,No Fish Curry,Start From 1st July2026,  Cancelled XXX', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and Dinner,No Fish Curry,Start From 1st July2026,  Cancelled XXX')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-346', 'b0000000-0000-0000-0000-000000000001', 'CUST-346', 'Nakshon', '+971 50 3251615', 'nakshon@example.ae', 'bld-179', '2026-03-03', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and DinnerStart From 1st July2026 | Cancelling on 31st July❌, Please provide breakfast also  tomorrow, Need 3 times on 30th & 31st July | 2026-07-31 | 2026-07-31 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and DinnerStart From 1st July2026 | Cancelling on 31st July❌, Please provide breakfast also  tomorrow, Need 3 times on 30th & 31st July | 2026-07-31 | 2026-07-31 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-347', 'b0000000-0000-0000-0000-000000000001', 'CUST-347', 'Nandu', '+971 50 9347215', 'nandu@example.ae', 'bld-180', '6', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and Dinner,Lunch Handmade chappathi,No porotta,No Ghee riceStart From 1st July2026,  Cancelled❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and Dinner,Lunch Handmade chappathi,No porotta,No Ghee riceStart From 1st July2026,  Cancelled❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-348', 'b0000000-0000-0000-0000-000000000001', 'CUST-348', 'Sreelakshmy', '+971 50 9431291', 'sreelakshmy@example.ae', 'bld-181', '102', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time  , Deliver @6.00 Am,No chappathi,No PorottaStart from 2nd July 2026,   Cancelling on 31st July 2026❌ | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time  , Deliver @6.00 Am,No chappathi,No PorottaStart from 2nd July 2026,   Cancelling on 31st July 2026❌ | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-349', 'b0000000-0000-0000-0000-000000000001', 'CUST-349', 'Anu', '+971 50 8860732', 'anu@example.ae', 'bld-115', '408', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time  , No Rice dinner ,Start from 2ndJuly 2026, Cancelled❌❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time  , No Rice dinner ,Start from 2ndJuly 2026, Cancelled❌❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-350', 'b0000000-0000-0000-0000-000000000001', 'CUST-350', 'Aishwarya', '+971 50 1733036', 'aishwarya@example.ae', 'bld-182', '103', 'mp-3-times', true, true, true, 380, '1 | 0 | 1 Time, Lunch OnlyStart From 2nd July2026,Cancelling on 31st July 2026❌ | 100dhs | 2026-07-31 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 1 Time, Lunch OnlyStart From 2nd July2026,Cancelling on 31st July 2026❌ | 100dhs | 2026-07-31 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-351', 'b0000000-0000-0000-0000-000000000001', 'CUST-351', 'Jamsheed', '+971 50 8141195', 'jamsheed@example.ae', 'bld-115', '408', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,Start From 4th July02026, Cancelled❌❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,Start From 4th July02026, Cancelled❌❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-352', 'b0000000-0000-0000-0000-000000000001', 'CUST-352', 'Archana', '+971 50 8434810', 'archana@example.ae', 'bld-183', '23', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time Lunch and Dinner,No Chappathi,Morning Delivery 7 Am start From 4th July02026 | Cancelled❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time Lunch and Dinner,No Chappathi,Morning Delivery 7 Am start From 4th July02026 | Cancelled❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-353', 'b0000000-0000-0000-0000-000000000001', 'CUST-353', 'Suresh', '+971 50 7676573', 'suresh@example.ae', 'bld-184', '102', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time, Deliver 6.00 AmStart From 7th July 2026,                           Cancelling on 1st Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time, Deliver 6.00 AmStart From 7th July 2026,                           Cancelling on 1st Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-354', 'b0000000-0000-0000-0000-000000000001', 'CUST-354', 'Bhajeesh', '+971 50 7390657', 'bhajeesh@example.ae', 'bld-185', 'R 01', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time ,No Porota,Delivery 5.45 Am,Start from 9th 2026, Cancelling tomorrow 31st July 2026❌❌❌❌ ,Lunch - Chapathi set, No fish items,No beef,Deliver @ 5:45 am | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time ,No Porota,Delivery 5.45 Am,Start from 9th 2026, Cancelling tomorrow 31st July 2026❌❌❌❌ ,Lunch - Chapathi set, No fish items,No beef,Deliver @ 5:45 am | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-355', 'b0000000-0000-0000-0000-000000000001', 'CUST-355', 'Anandhu', '+971 50 4486500', 'anandhu@example.ae', 'bld-185', 'R 01', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time ,No Porota,No Beef,No Valleppam,Delivery 5.45 Am,Start from 9th 2026, Cancelling tomorrow 31st July 2026❌❌❌❌,Lunch - Chapathi set, No fish items,No beef,Deliver @ 5:45 am', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time ,No Porota,No Beef,No Valleppam,Delivery 5.45 Am,Start from 9th 2026, Cancelling tomorrow 31st July 2026❌❌❌❌,Lunch - Chapathi set, No fish items,No beef,Deliver @ 5:45 am')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-356', 'b0000000-0000-0000-0000-000000000001', 'CUST-356', 'Rahul', '+971 50 1760062', 'rahul@example.ae', 'bld-185', 'R 01', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time ,No Fish,Lunch Chappathi set,No Beef,Delivery 5.45 Am,Start from 9th 2026, Cancelling tomorrow 31st July 2026❌❌❌❌, Lunch - Chapathi set, No fish items,No beef,Deliver @ 5:45 am', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time ,No Fish,Lunch Chappathi set,No Beef,Delivery 5.45 Am,Start from 9th 2026, Cancelling tomorrow 31st July 2026❌❌❌❌, Lunch - Chapathi set, No fish items,No beef,Deliver @ 5:45 am')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-357', 'b0000000-0000-0000-0000-000000000001', 'CUST-357', 'Cyriac', '+971 50 9159764', 'cyriac@example.ae', 'bld-186', '103', 'mp-3-times', true, true, true, 380, '0 | 1 | 2 Time,Breakfast and Dinner ,Delivery Inside the flat,Start from 9th 2026, Cancelled❌❌ | 80 DHS RECEIVED  UPTO JULY 31/7/2026 | 31/7/2026 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 2 Time,Breakfast and Dinner ,Delivery Inside the flat,Start from 9th 2026, Cancelled❌❌ | 80 DHS RECEIVED  UPTO JULY 31/7/2026 | 31/7/2026 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-358', 'b0000000-0000-0000-0000-000000000001', 'CUST-358', 'Divya', '+971 50 6730707', 'divya@example.ae', 'bld-187', '202', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,Delivery 6.15 am, No Chicken ,Start From 12th July2026, Cancelled XXX | 329 DHS RECEIVED  UP TO 31/7/2026 | 31/7/2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,Delivery 6.15 am, No Chicken ,Start From 12th July2026, Cancelled XXX | 329 DHS RECEIVED  UP TO 31/7/2026 | 31/7/2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-359', 'b0000000-0000-0000-0000-000000000001', 'CUST-359', 'Adithya', '+971 50 1380944', 'adithya@example.ae', 'bld-188', '32', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch And Dinner,Start From 13th July2026 | Cancelling on 31st July 2026❌ | 2026-07-31 | 2026-07-31 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch And Dinner,Start From 13th July2026 | Cancelling on 31st July 2026❌ | 2026-07-31 | 2026-07-31 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-360', 'b0000000-0000-0000-0000-000000000001', 'CUST-360', 'Harshan', '+971 50 5825549', 'harshan@example.ae', 'bld-189', '202', 'mp-3-times', true, true, true, 380, '0 | 1 | 2 Time,Breakfast and Dinner ,Delivery 6.15 Am ,Start From 16th July2026, Cancelled XXX', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 2 Time,Breakfast and Dinner ,Delivery 6.15 Am ,Start From 16th July2026, Cancelled XXX')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-361', 'b0000000-0000-0000-0000-000000000001', 'CUST-361', 'Sreelashmi', '+971 50 3071409', 'sreelashmi@example.ae', 'bld-190', '303', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch And Dinner,Start From 17th July2026,                                                  Restart from 30th July ✅,
Hold after Sunday''s Lunch, 2nd Aug 2026,On hold⚠️, Please don’t deliver on Saturday. Will inform to restart | 100 DHS RECEIEVD | 15/8/2026 | 200 DHS', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch And Dinner,Start From 17th July2026,                                                  Restart from 30th July ✅,
Hold after Sunday''s Lunch, 2nd Aug 2026,On hold⚠️, Please don’t deliver on Saturday. Will inform to restart | 100 DHS RECEIEVD | 15/8/2026 | 200 DHS')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-362', 'b0000000-0000-0000-0000-000000000001', 'CUST-362', 'Srilakshmi', '+971 50 3106241', 'srilakshmi@example.ae', 'bld-191', '104', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch And Dinner,No Beef,Start From 22nd July2026, Cancelling on 31st July 2026❌ | 100 DHS RECEIVED UP TO  31ST JULY 2026 | 31/7/2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch And Dinner,No Beef,Start From 22nd July2026, Cancelling on 31st July 2026❌ | 100 DHS RECEIVED UP TO  31ST JULY 2026 | 31/7/2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-363', 'b0000000-0000-0000-0000-000000000001', 'CUST-363', 'THAHIR A', '+971 50 9321659', 'thahira@example.ae', 'bld-192', '13', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 TIMES, START FROM 27TH JULY 2026, Cancelled on 31st July 2026❌❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 TIMES, START FROM 27TH JULY 2026, Cancelled on 31st July 2026❌❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-364', 'b0000000-0000-0000-0000-000000000001', 'CUST-364', 'THAHIR B', '+971 50 3598138', 'thahirb@example.ae', 'bld-192', '13', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 TIMES, START FROM 27TH JULY 2026,Cancelled on 31st July 2026❌❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 TIMES, START FROM 27TH JULY 2026,Cancelled on 31st July 2026❌❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-365', 'b0000000-0000-0000-0000-000000000001', 'CUST-365', 'OLIVIYA', '+971 50 5959330', 'oliviya@example.ae', 'bld-193', '301', 'mp-3-times', true, true, true, 380, '1 | 0 | START FROM 29 TH JULY 2026, Lunch only, Cancelled❌ | 180 Dhs Received', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | START FROM 29 TH JULY 2026, Lunch only, Cancelled❌ | 180 Dhs Received')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-366', 'b0000000-0000-0000-0000-000000000001', 'CUST-366', 'Gopika', '+971 50 2345241', 'gopika@example.ae', 'bld-194', 'Room 32', 'mp-3-times', true, true, true, 380, '1 | 1 | Lunch & dinner, 
7 days trial
Passcode: 4950#
Start from 11th June 2026✅,Cancelling on 1st Aug 2026❌ | 310 | 1st August 2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | Lunch & dinner, 
7 days trial
Passcode: 4950#
Start from 11th June 2026✅,Cancelling on 1st Aug 2026❌ | 310 | 1st August 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-367', 'b0000000-0000-0000-0000-000000000001', 'CUST-367', 'Akhilesh', '+971 50 5849069', 'akhilesh@example.ae', 'bld-195', '101', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch and Dinner ,Lunch Chappathi set Delivery @6.15 am,Start From 1st July 2026, Cancelling on 31st July 2026XXX | 300', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch and Dinner ,Lunch Chappathi set Delivery @6.15 am,Start From 1st July 2026, Cancelling on 31st July 2026XXX | 300')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-368', 'b0000000-0000-0000-0000-000000000001', 'CUST-368', 'Anandhan', '+971 50 9995077', 'anandhan@example.ae', 'bld-196', '208', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time ,Breakfast and Lunch ,Delivery 5.45 Am ,Lunch Barik Rice,Cancelling on 1st Aug 2026XXX', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time ,Breakfast and Lunch ,Delivery 5.45 Am ,Lunch Barik Rice,Cancelling on 1st Aug 2026XXX')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-369', 'b0000000-0000-0000-0000-000000000001', 'CUST-369', 'Athulya', '+971 50 2076580', 'athulya@example.ae', 'bld-196', '208', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time ,Breakfast and Lunch ,Delivery 5.45 Am ,                       Cancelling on 1st Aug 2026XXX', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time ,Breakfast and Lunch ,Delivery 5.45 Am ,                       Cancelling on 1st Aug 2026XXX')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-370', 'b0000000-0000-0000-0000-000000000001', 'CUST-370', 'Abhi', '+971 50 2839018', 'abhi@example.ae', 'bld-192', '37', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and DinnerStart From 1st July2026, Cancelling tomorrow, 1st Aug 2026❌❌❌❌ | 2026-08-01 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and DinnerStart From 1st July2026, Cancelling tomorrow, 1st Aug 2026❌❌❌❌ | 2026-08-01 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-371', 'b0000000-0000-0000-0000-000000000001', 'CUST-371', 'Athul', '+971 50 8892304', 'athul@example.ae', 'bld-192', '37', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time  ,Start from 1st July 2026, Cancelling tomorrow, 1st Aug 2026❌❌❌❌ | 2026-08-01 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time  ,Start from 1st July 2026, Cancelling tomorrow, 1st Aug 2026❌❌❌❌ | 2026-08-01 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-372', 'b0000000-0000-0000-0000-000000000001', 'CUST-372', 'Nandhu', '+971 50 3290127', 'nandhu@example.ae', 'bld-192', '37', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time  ,Start from 1st July 2026, Cancelling tomorrow, 1st Aug 2026❌❌❌❌ | 2026-08-01 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time  ,Start from 1st July 2026, Cancelling tomorrow, 1st Aug 2026❌❌❌❌ | 2026-08-01 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-373', 'b0000000-0000-0000-0000-000000000001', 'CUST-373', 'Sherin', '+971 50 5932759', 'sherin@example.ae', 'bld-197', '301', 'mp-3-times', true, true, true, 380, '1 | 0 | 2 Time, Lunch and DinnerStart From 3th July2026, Cancel after tomorrow’s lunch, 1st Aug 2026❌, Please don’t deliver dinner', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2 Time, Lunch and DinnerStart From 3th July2026, Cancel after tomorrow’s lunch, 1st Aug 2026❌, Please don’t deliver dinner')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-374', 'b0000000-0000-0000-0000-000000000001', 'CUST-374', 'Nikhil', '+971 50 5445024', 'nikhil@example.ae', 'bld-198', '101', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and DinnerStart From 3th July2026,                                                      Cancelling on 2nd Aug 2026❌ | 2026-08-31 | 290', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and DinnerStart From 3th July2026,                                                      Cancelling on 2nd Aug 2026❌ | 2026-08-31 | 290')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-375', 'b0000000-0000-0000-0000-000000000001', 'CUST-375', 'Shafi', '+971 50 2673727', 'shafi@example.ae', 'bld-199', '209', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and DinnerStart From 4th July2026,                                                        Cancelling on 2nd Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and DinnerStart From 4th July2026,                                                        Cancelling on 2nd Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-376', 'b0000000-0000-0000-0000-000000000001', 'CUST-376', 'Athira', '+971 50 1287955', 'athira@example.ae', 'bld-154', '408', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time Lunch and Dinner,Morning Delivery 7 Am start From 4th July02026, Cancelling on 2nd Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time Lunch and Dinner,Morning Delivery 7 Am start From 4th July02026, Cancelling on 2nd Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-377', 'b0000000-0000-0000-0000-000000000001', 'CUST-377', 'Rashmi', '+971 50 4433618', 'rashmi@example.ae', 'bld-129', '205', 'mp-3-times', true, true, true, 380, '1 | 0 | 2 Time,Breakfast And Lunch ,Start From 13th July2026 | Cancelling on 1st Aug 2026❌ | 2026-08-01 | 2026-08-01 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2 Time,Breakfast And Lunch ,Start From 13th July2026 | Cancelling on 1st Aug 2026❌ | 2026-08-01 | 2026-08-01 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-378', 'b0000000-0000-0000-0000-000000000001', 'CUST-378', 'MANU', '+971 50 7101681', 'manu@example.ae', 'bld-200', '7', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 TIMES, START FROM 27TH JULY 2026 | Cancelled ❌ | 70 DHS RECEIVED UPTO 7 DAYS (TRAIL) | 2/8//2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 TIMES, START FROM 27TH JULY 2026 | Cancelled ❌ | 70 DHS RECEIVED UPTO 7 DAYS (TRAIL) | 2/8//2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-379', 'b0000000-0000-0000-0000-000000000001', 'CUST-379', 'TEENA', '+971 50 1050228', 'teena@example.ae', 'bld-200', '7', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 TIMES, START FROM 27TH JULY 2026 | 70 DHS RECEIVED UPTO 7 DAYS (TRAIL) | 2026-02-08', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 TIMES, START FROM 27TH JULY 2026 | 70 DHS RECEIVED UPTO 7 DAYS (TRAIL) | 2026-02-08')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-380', 'b0000000-0000-0000-0000-000000000001', 'CUST-380', 'THASNI', '+971 50 1643648', 'thasni@example.ae', 'bld-201', '304', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 TIMES , START FROM 26 TH JULY 2026, Cancelled ❌ | 70 DHS RECEIVED', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 TIMES , START FROM 26 TH JULY 2026, Cancelled ❌ | 70 DHS RECEIVED')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-381', 'b0000000-0000-0000-0000-000000000001', 'CUST-381', 'Thahir D', '+971 50 4125696', 'thahird@example.ae', 'bld-202', '311', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 times, Start from 30th July 2026✅
Cancel on 8th Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 times, Start from 30th July 2026✅
Cancel on 8th Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-382', 'b0000000-0000-0000-0000-000000000001', 'CUST-382', 'Grafin', '+971 50 6114370', 'grafin@example.ae', 'bld-203', '102', 'mp-3-times', true, true, true, 380, '0 | 1 | Deliver on the top of refregirator | Dinner only from 4th Dec 2025 | 180 dhs | 2026-07-31', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | Deliver on the top of refregirator | Dinner only from 4th Dec 2025 | 180 dhs | 2026-07-31')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-383', 'b0000000-0000-0000-0000-000000000001', 'CUST-383', 'Devika', '+971 50 6198033', 'devika@example.ae', 'bld-204', '3 A', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,No Fish curry for Dinner, start From 4th July02026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,No Fish curry for Dinner, start From 4th July02026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-384', 'b0000000-0000-0000-0000-000000000001', 'CUST-384', 'Mithun', '+971 50 1439531', 'mithun@example.ae', 'bld-205', '27', 'mp-3-times', true, true, true, 380, '0 | 1 | 2 Time,Breakfast and DinnerNo Rice item | No pathiri, need chapathi set instead | No porota Cancelled on 5 Aug 2026❌ | 2026-08-05 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 2 Time,Breakfast and DinnerNo Rice item | No pathiri, need chapathi set instead | No porota Cancelled on 5 Aug 2026❌ | 2026-08-05 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-385', 'b0000000-0000-0000-0000-000000000001', 'CUST-385', 'Rithun', '+971 50 4721784', 'rithun@example.ae', 'bld-205', '27', 'mp-3-times', true, true, true, 380, '0 | 1 | 2 Time,Breakfast and Dinner.No Pathiri | He is on protein diet, No rice items, Need fried chicken+ chapathi instead, or any veg items. No porota Cancelled on 5 Aug 2026❌ | 2026-08-05 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 2 Time,Breakfast and Dinner.No Pathiri | He is on protein diet, No rice items, Need fried chicken+ chapathi instead, or any veg items. No porota Cancelled on 5 Aug 2026❌ | 2026-08-05 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-386', 'b0000000-0000-0000-0000-000000000001', 'CUST-386', 'BELLA', '+971 50 4623417', 'bella@example.ae', 'bld-145', '207', 'mp-3-times', true, true, true, 380, '0 | 1 | 1 TIME, DINNER ONLY , START FROM 3 RD AUGUST 2026 ,                                               NO POROTA -NEED CHAPATHI INSTEAD, DELIVER INSIDE THE SHEO RACK', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 1 TIME, DINNER ONLY , START FROM 3 RD AUGUST 2026 ,                                               NO POROTA -NEED CHAPATHI INSTEAD, DELIVER INSIDE THE SHEO RACK')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-387', 'b0000000-0000-0000-0000-000000000001', 'CUST-387', 'Albin', '+971 50 5761283', 'albin@example.ae', 'bld-206', '106', 'mp-3-times', true, true, true, 380, '1 | 0 | Lunch only | Start from 3rd Aug 2026✅', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | Lunch only | Start from 3rd Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-388', 'b0000000-0000-0000-0000-000000000001', 'CUST-388', 'Safvan', '+971 50 6309818', 'safvan@example.ae', 'bld-207', '12', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,Morning Delivery 6.30 Am, start From 6th July02026, Cancelling on 5th Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,Morning Delivery 6.30 Am, start From 6th July02026, Cancelling on 5th Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-389', 'b0000000-0000-0000-0000-000000000001', 'CUST-389', 'Sreerag', '+971 50 1583643', 'sreerag@example.ae', 'bld-115', '408', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time,Start From 13th July2026 | Cancelling on 6th Aug 2026❌ | 2026-08-06 | 2026-08-06 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time,Start From 13th July2026 | Cancelling on 6th Aug 2026❌ | 2026-08-06 | 2026-08-06 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-390', 'b0000000-0000-0000-0000-000000000001', 'CUST-390', 'Anusha', '+971 50 1124082', 'anusha@example.ae', 'bld-208', '205 A Block', 'mp-3-times', true, true, true, 380, '1 | 0 | Lunch Only,No Fish curry,
Starting from 2nd Dec 2025 | Lunch only from , Strictly NO FISH CURRY | 2026-07-31 | 2026-08-06 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | Lunch Only,No Fish curry,
Starting from 2nd Dec 2025 | Lunch only from , Strictly NO FISH CURRY | 2026-07-31 | 2026-08-06 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-391', 'b0000000-0000-0000-0000-000000000001', 'CUST-391', 'Shefni', '+971 50 7792434', 'shefni@example.ae', 'bld-209', '10', 'mp-3-times', true, true, true, 380, '0 | 1 | Breakfast & Dinner,Deliver @ 6:45 AM
Start from 3rd Aug 2026✅', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | Breakfast & Dinner,Deliver @ 6:45 AM
Start from 3rd Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-392', 'b0000000-0000-0000-0000-000000000001', 'CUST-392', 'Sreejini', '+971 50 9198120', 'sreejini@example.ae', 'bld-210', '702', 'mp-3-times', true, true, true, 380, '1 | 0 | Lunch only
Start from 3rd Aug 2026✅ Cancelled on 6 Aug 2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | Lunch only
Start from 3rd Aug 2026✅ Cancelled on 6 Aug 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-393', 'b0000000-0000-0000-0000-000000000001', 'CUST-393', 'Ajin', '+971 50 7317084', 'ajin@example.ae', 'bld-115', '302', 'mp-3-times', true, true, true, 380, '0 | 1 | 1 Time,Dinner Only,No Wheat Dosa,No Pathiri,Start from 9th 2026, | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 1 Time,Dinner Only,No Wheat Dosa,No Pathiri,Start from 9th 2026, | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-394', 'b0000000-0000-0000-0000-000000000001', 'CUST-394', 'Aneesha', '+971 50 3157408', 'aneesha@example.ae', 'bld-211', '305', 'mp-3-times', true, true, true, 380, '1 | 0 | 1 Time ,Lunch Only,Start from 8th July 2026, Cancelling on 7th Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 1 Time ,Lunch Only,Start from 8th July 2026, Cancelling on 7th Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-395', 'b0000000-0000-0000-0000-000000000001', 'CUST-395', 'Jaseem', '+971 50 3672425', 'jaseem@example.ae', 'bld-212', '21', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 times,Deliver @ 6:15 AM,Deliver on the shoe rack,                                      Start from 1st Aug 2026✅', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 times,Deliver @ 6:15 AM,Deliver on the shoe rack,                                      Start from 1st Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-396', 'b0000000-0000-0000-0000-000000000001', 'CUST-396', 'Ramees', '+971 50 7852421', 'ramees@example.ae', 'bld-213', '212', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 times,  Start from 1st Aug 2026✅ | 90', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 times,  Start from 1st Aug 2026✅ | 90')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-397', 'b0000000-0000-0000-0000-000000000001', 'CUST-397', 'Vipin Gym', '+971 50 9734947', 'vipingym@example.ae', 'bld-214', '305', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time  ,Saturday Lunch 12 Pm,Start from 30thJuly 2026 | 2026-08-31 | 108', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time  ,Saturday Lunch 12 Pm,Start from 30thJuly 2026 | 2026-08-31 | 108')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-398', 'b0000000-0000-0000-0000-000000000001', 'CUST-398', 'Chindhu', '+971 50 8287494', 'chindhu@example.ae', 'bld-174', '308', 'mp-3-times', true, true, true, 380, '1 | 0 | 1 Time , Lunch Only,No Dosa,No Ghee Rice | 2026-07-31 | 2026-08-31 | 48', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 1 Time , Lunch Only,No Dosa,No Ghee Rice | 2026-07-31 | 2026-08-31 | 48')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-399', 'b0000000-0000-0000-0000-000000000001', 'CUST-399', 'Noel', '+971 50 7506295', 'noel@example.ae', 'bld-215', '106', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch and Dinner Start from 8th 2026', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch and Dinner Start from 8th 2026')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-400', 'b0000000-0000-0000-0000-000000000001', 'CUST-400', 'Subish', '+971 50 2820405', 'subish@example.ae', 'bld-216', '203', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch and Dinner ,Lunch 12 Pm,Lunch Chappathi set,No Normal Rice ,Delivery Inside the flat,Start from 10th 2026 |Cancelling on 9th Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch and Dinner ,Lunch 12 Pm,Lunch Chappathi set,No Normal Rice ,Delivery Inside the flat,Start from 10th 2026 |Cancelling on 9th Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-401', 'b0000000-0000-0000-0000-000000000001', 'CUST-401', 'Neethu', '+971 50 2226618', 'neethu@example.ae', 'bld-217', '404', 'mp-3-times', true, true, true, 380, '1 | 0 | Lunch only, Start from 3rd Aug 2026✅ Cancelling on 9 August 2026 ❌ | 2026-08-09 | 0 | Sunset Building | 404 | Neethu | 0 | 1 | 0 | Lunch only, Start from 3rd Aug 2026✅ Cancelling on 9 August 2026 ❌ | 2026-08-09 | 0', '2026-07-01', '2026-07-01', 'left', 'Late payer', '1 | 0 | Lunch only, Start from 3rd Aug 2026✅ Cancelling on 9 August 2026 ❌ | 2026-08-09 | 0 | Sunset Building | 404 | Neethu | 0 | 1 | 0 | Lunch only, Start from 3rd Aug 2026✅ Cancelling on 9 August 2026 ❌ | 2026-08-09 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-402', 'b0000000-0000-0000-0000-000000000001', 'CUST-402', 'Sukanya', '+971 50 6243668', 'sukanya@example.ae', 'bld-218', '205', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch And Dinner,Start From 19th July2026 | 300 Dhs | 23/8/2026 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch And Dinner,Start From 19th July2026 | 300 Dhs | 23/8/2026 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-403', 'b0000000-0000-0000-0000-000000000001', 'CUST-403', 'Susmitha', '+971 50 8366610', 'susmitha@example.ae', 'bld-219', '201', 'mp-3-times', true, true, true, 380, '0 | 1 | 1 Time Dinner Only,Saturday And Sunday off,Start From 8th July2026 Cancelling on 10th Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 1 Time Dinner Only,Saturday And Sunday off,Start From 8th July2026 Cancelling on 10th Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-404', 'b0000000-0000-0000-0000-000000000001', 'CUST-404', 'Thahir E', '+971 50 6368422', 'thahire@example.ae', 'bld-220', '12', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 times, Lunch @ noon, Start from 1st Aug 2026✅', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 times, Lunch @ noon, Start from 1st Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-405', 'b0000000-0000-0000-0000-000000000001', 'CUST-405', 'Thahir F', '+971 50 4174315', 'thahirf@example.ae', 'bld-220', '12', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 times, Start from 1st Aug 2026✅', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 times, Start from 1st Aug 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-406', 'b0000000-0000-0000-0000-000000000001', 'CUST-406', 'Tony', '+971 50 4327568', 'tony@example.ae', 'bld-221', '201', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and Dinner,Deliver @ 6.45 Am,Start From 2nd July2026, Cancelling on 10th Aug 2026❌ | 2026-08-10', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and Dinner,Deliver @ 6.45 Am,Start From 2nd July2026, Cancelling on 10th Aug 2026❌ | 2026-08-10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-407', 'b0000000-0000-0000-0000-000000000001', 'CUST-407', 'Sujisha', '+971 50 5766164', 'sujisha@example.ae', 'bld-222', '308', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and Dinner,Lunch Barik RiceStart From 3th July2026,All Saturday Lunch 12 Pm  | No fish items | Cancelled ❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and Dinner,Lunch Barik RiceStart From 3th July2026,All Saturday Lunch 12 Pm  | No fish items | Cancelled ❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-408', 'b0000000-0000-0000-0000-000000000001', 'CUST-408', 'Jayalakshmi', '+971 50 5802106', 'jayalakshmi@example.ae', 'bld-223', '201', 'mp-3-times', true, true, true, 380, '1 | 1 | Lunch & dinner 
Lunch @ noon
Restart from 3rd Aug 2026✅ Cancelled on 11 August 2026 ❌ | 2026-08-31 | 620', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | Lunch & dinner 
Lunch @ noon
Restart from 3rd Aug 2026✅ Cancelled on 11 August 2026 ❌ | 2026-08-31 | 620')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-409', 'b0000000-0000-0000-0000-000000000001', 'CUST-409', 'Nihal', '+971 50 4527656', 'nihal@example.ae', 'bld-224', '609', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time Cancelled ❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time Cancelled ❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-410', 'b0000000-0000-0000-0000-000000000001', 'CUST-410', 'Syam', '+971 50 7780408', 'syam@example.ae', 'bld-225', '36', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch and Dinner ,Start from 11th 2026 Cancelled ❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch and Dinner ,Start from 11th 2026 Cancelled ❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-411', 'b0000000-0000-0000-0000-000000000001', 'CUST-411', 'Linta', '+971 50 1011885', 'linta@example.ae', 'bld-226', '338', 'mp-3-times', true, true, true, 380, '0 | 1 | 3 Time,Morning Delivery 6.30 Am,No Fish curry for Lunch, start From 6th July02026 Cancelling on 13 August 2026❌ | 2026-08-14 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 3 Time,Morning Delivery 6.30 Am,No Fish curry for Lunch, start From 6th July02026 Cancelling on 13 August 2026❌ | 2026-08-14 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-412', 'b0000000-0000-0000-0000-000000000001', 'CUST-412', 'MATHEWS', '+971 50 6899238', 'mathews@example.ae', 'bld-132', '517', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 TIMES, START FROM 29TH JULY 2026 ,                                                                                      CACNELLING ON 13RD  AUGUST 2026 XXX', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 TIMES, START FROM 29TH JULY 2026 ,                                                                                      CACNELLING ON 13RD  AUGUST 2026 XXX')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-413', 'b0000000-0000-0000-0000-000000000001', 'CUST-413', 'Adhil', '+971 50 9609050', 'adhil@example.ae', 'bld-227', '212/4', 'mp-3-times', true, true, true, 380, '1 | 0 | 2 Time, Breakfast and DinnerStart From 1st July2026 Cancelling on 14 August 2026❌ | 2026-08-14 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 2 Time, Breakfast and DinnerStart From 1st July2026 Cancelling on 14 August 2026❌ | 2026-08-14 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-414', 'b0000000-0000-0000-0000-000000000001', 'CUST-414', 'Joseph', '+971 50 4442026', 'joseph@example.ae', 'bld-228', '104', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time Cancelled on 15 August 2026 | 2026-08-15 | 226', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time Cancelled on 15 August 2026 | 2026-08-15 | 226')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-415', 'b0000000-0000-0000-0000-000000000001', 'CUST-415', 'Maqbool', '+971 50 8715920', 'maqbool@example.ae', 'bld-229', '35/11', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and Dinner,Lunch Afternoon 12 Pm Cancelling from 15 August 2026 ❌ | 2026-08-31 | 100', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and Dinner,Lunch Afternoon 12 Pm Cancelling from 15 August 2026 ❌ | 2026-08-31 | 100')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-416', 'b0000000-0000-0000-0000-000000000001', 'CUST-416', 'Vibith', '+971 50 8095047', 'vibith@example.ae', 'bld-221', '201', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and Dinner,Deliver @ 6.45 Am,Start From 2nd July2026, Cancelling on 15th Aug 2026❌ | 2026-08-15 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and Dinner,Deliver @ 6.45 Am,Start From 2nd July2026, Cancelling on 15th Aug 2026❌ | 2026-08-15 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-417', 'b0000000-0000-0000-0000-000000000001', 'CUST-417', 'Yadhu', '+971 50 2712377', 'yadhu@example.ae', 'bld-151', '24', 'mp-3-times', true, true, true, 380, '1 | 0 | 3 Time, Start From 7th July 2026, Lunch only from 1st August 2026, Cancelling on 15th Aug 2026❌ | 2026-08-15 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 3 Time, Start From 7th July 2026, Lunch only from 1st August 2026, Cancelling on 15th Aug 2026❌ | 2026-08-15 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-418', 'b0000000-0000-0000-0000-000000000001', 'CUST-418', 'Eldho', '+971 50 1003102', 'eldho@example.ae', 'bld-230', '428', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time | Cancelling on 15th August 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time | Cancelling on 15th August 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-419', 'b0000000-0000-0000-0000-000000000001', 'CUST-419', 'Vaisakh', '+971 50 1242213', 'vaisakh@example.ae', 'bld-231', '205', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time, Start From 21st July2026 Cancelling on 15 Aug 2026❌ | 2026-08-15 | 190', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time, Start From 21st July2026 Cancelling on 15 Aug 2026❌ | 2026-08-15 | 190')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-420', 'b0000000-0000-0000-0000-000000000001', 'CUST-420', 'Suhail', '+971 50 1332396', 'suhail@example.ae', 'bld-224', '708', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 times ,No chapathi,No porota,Dinner rice items preferred (Serve rice if available),Start from 1st Aug 2026✅, Cancelling on 15th Aug 2026❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 times ,No chapathi,No porota,Dinner rice items preferred (Serve rice if available),Start from 1st Aug 2026✅, Cancelling on 15th Aug 2026❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-421', 'b0000000-0000-0000-0000-000000000001', 'CUST-421', 'Nishad', '+971 50 1893670', 'nishad@example.ae', 'bld-162', '102', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time, Lunch and DinnerStart From 30th July2026 | 420', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time, Lunch and DinnerStart From 30th July2026 | 420')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-422', 'b0000000-0000-0000-0000-000000000001', 'CUST-422', 'Thahir C', '+971 50 4596476', 'thahirc@example.ae', 'bld-232', '204', 'mp-3-times', true, true, true, 380, '1 | 1 | Starting from 12 August 2026✅ Cancelled ❌', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | Starting from 12 August 2026✅ Cancelled ❌')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-423', 'b0000000-0000-0000-0000-000000000001', 'CUST-423', 'Hari', '+971 50 4135609', 'hari@example.ae', 'bld-195', '302', 'mp-3-times', true, true, true, 380, '1 | 1 | Lunch & Dinner
Starting from 3rd Feb 2026 | deliver in the kitchen Cancellig on 18 August 2026❌ | 2026-08-18 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | Lunch & Dinner
Starting from 3rd Feb 2026 | deliver in the kitchen Cancellig on 18 August 2026❌ | 2026-08-18 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-424', 'b0000000-0000-0000-0000-000000000001', 'CUST-424', 'Vivek', '+971 50 4786819', 'vivek@example.ae', 'bld-195', '302', 'mp-3-times', true, true, true, 380, '1 | 1 | Lunch & dinner
Starting from 12th Feb 2026 Cancelling on 18 August 2026❌ | 2026-07-31 | 2026-08-18 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | Lunch & dinner
Starting from 12th Feb 2026 Cancelling on 18 August 2026❌ | 2026-07-31 | 2026-08-18 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-425', 'b0000000-0000-0000-0000-000000000001', 'CUST-425', 'Afzar', '+971 50 5318637', 'afzar@example.ae', 'bld-158', '104', 'mp-3-times', true, true, true, 380, '0 | 1 | 2 Time,Breakfast and Dinner ,Delivery Inside the flat,Start from 10th 2026 Cancelled ❌ | 2026-08-19 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 2 Time,Breakfast and Dinner ,Delivery Inside the flat,Start from 10th 2026 Cancelled ❌ | 2026-08-19 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-426', 'b0000000-0000-0000-0000-000000000001', 'CUST-426', 'Reeza', '+971 50 5868176', 'reeza@example.ae', 'bld-233', '205', 'mp-3-times', true, true, true, 380, '1 | 1 | 1 | 3 Time, Start From 21st July2026 Cancelled ❌ | 2026-08-19 | 13', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 1 | 3 Time, Start From 21st July2026 Cancelled ❌ | 2026-08-19 | 13')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-427', 'b0000000-0000-0000-0000-000000000001', 'CUST-427', 'Karthika', '+971 50 6090729', 'karthika@example.ae', 'bld-234', '7', 'mp-3-times', true, true, true, 380, '1 | 1 | 0 | 2 Time,Break Fast and Lunch,Delivery 6.15 amStart From 13th July2026, No wheat dosa Cancelling on 20th Aug 2026❌❌ | 2026-08-20 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 0 | 2 Time,Break Fast and Lunch,Delivery 6.15 amStart From 13th July2026, No wheat dosa Cancelling on 20th Aug 2026❌❌ | 2026-08-20 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-428', 'b0000000-0000-0000-0000-000000000001', 'CUST-428', 'Raghesh', '+971 50 9033351', 'raghesh@example.ae', 'bld-234', '7', 'mp-3-times', true, true, true, 380, '1 | 1 | 1 | 3 Time,Delivery 6.15 amStart From 13th July2026, No wheat dosa Cancelling on 20th Aug 2026❌❌ | 2026-08-20 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 1 | 3 Time,Delivery 6.15 amStart From 13th July2026, No wheat dosa Cancelling on 20th Aug 2026❌❌ | 2026-08-20 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-429', 'b0000000-0000-0000-0000-000000000001', 'CUST-429', 'Hashmi', '+971 50 6134421', 'hashmi@example.ae', 'bld-227', '212/4', 'mp-3-times', true, true, true, 380, '0 | 1 | 0 | 1 Time, Lunch Only , Lunch Chappathi set,Start From 1st July2026 Cancelling on 20 August 2026 ❌ | 2026-08-20 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 0 | 1 Time, Lunch Only , Lunch Chappathi set,Start From 1st July2026 Cancelling on 20 August 2026 ❌ | 2026-08-20 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-430', 'b0000000-0000-0000-0000-000000000001', 'CUST-430', 'Febin', '+971 50 3601806', 'febin@example.ae', 'bld-235', 'Room 22
Floor 2nd floor', 'mp-3-times', true, true, true, 380, '1 | 1 | 1 | 3 times

Start from 17 June 2026✅ Cancelling on 20 august 2026❌ | 2026-08-31 | 260', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 1 | 3 times

Start from 17 June 2026✅ Cancelling on 20 august 2026❌ | 2026-08-31 | 260')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-431', 'b0000000-0000-0000-0000-000000000001', 'CUST-431', 'Devaduth', '+971 50 8308142', 'devaduth@example.ae', 'bld-236', '24', 'mp-3-times', true, true, true, 380, '0 | 1 | 0 | 1 Time , Lunch Only Cancelled ❌ | 2026-08-31 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 0 | 1 Time , Lunch Only Cancelled ❌ | 2026-08-31 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-432', 'b0000000-0000-0000-0000-000000000001', 'CUST-432', 'Rameez', '+971 50 4525125', 'rameez@example.ae', 'bld-237', '24', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 times | Passcode: 7580# | Start from 3rd Aug 2026✅ | 2026-08-31 | 0 | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 times | Passcode: 7580# | Start from 3rd Aug 2026✅ | 2026-08-31 | 0 | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-433', 'b0000000-0000-0000-0000-000000000001', 'CUST-433', 'Philip', '+971 50 9295521', 'philip@example.ae', 'bld-238', '204', 'mp-3-times', true, true, true, 380, '1 | 1 | 1 | Deliver @ 5:45 am
1-week trial
Starting from 16th Feb 2026 | 3 times from 23rd Feb Cancelling on 22nd Aug 2026❌ | 2026-08-22 | 2026-07-31 | 2026-08-22 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 1 | Deliver @ 5:45 am
1-week trial
Starting from 16th Feb 2026 | 3 times from 23rd Feb Cancelling on 22nd Aug 2026❌ | 2026-08-22 | 2026-07-31 | 2026-08-22 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-434', 'b0000000-0000-0000-0000-000000000001', 'CUST-434', 'Anjana', '+971 50 5283307', 'anjana@example.ae', 'bld-239', '304', 'mp-3-times', true, true, true, 380, '0 | 1 | 1 | Monday to Friday only - Saturday & Sunday - Don’t deliver
NO BEEF
No special lunch - Need chapathi set instead
Starting from 2nd Feb 2026 | Need lunch @5:30 am | No mandi-Need chapathi set Cancelling on 21 August 2026❌ | 2026-08-21 | 2026-07-31 | 2026-08-21 | 20', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 1 | Monday to Friday only - Saturday & Sunday - Don’t deliver
NO BEEF
No special lunch - Need chapathi set instead
Starting from 2nd Feb 2026 | Need lunch @5:30 am | No mandi-Need chapathi set Cancelling on 21 August 2026❌ | 2026-08-21 | 2026-07-31 | 2026-08-21 | 20')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-435', 'b0000000-0000-0000-0000-000000000001', 'CUST-435', 'Shifan', '+971 50 4818556', 'shifan@example.ae', 'bld-240', '106', 'mp-3-times', true, true, true, 380, '1 | 1 | 0 | Breakfast & lunch
1 week trial
Start from 12th June 2026✅ Cancelled ❌ | 2026-08-21 | 2026-08-31 | 0 | followed on 19 august | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 0 | Breakfast & lunch
1 week trial
Start from 12th June 2026✅ Cancelled ❌ | 2026-08-21 | 2026-08-31 | 0 | followed on 19 august | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-436', 'b0000000-0000-0000-0000-000000000001', 'CUST-436', 'Anzar', '+971 50 8652686', 'anzar@example.ae', 'bld-241', '206', 'mp-3-times', true, true, true, 380, '0 | 1 | 1 | 2 Time , Lunch and Dinner Cancelling on 21 August 2026❌ | 2026-08-21 | 2026-08-21 | 530 | followed on 19 august | Bad', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 1 | 2 Time , Lunch and Dinner Cancelling on 21 August 2026❌ | 2026-08-21 | 2026-08-21 | 530 | followed on 19 august | Bad')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-437', 'b0000000-0000-0000-0000-000000000001', 'CUST-437', 'Rejeesh', '+971 50 3796747', 'rejeesh@example.ae', 'bld-242', '142', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | No mandi , No ghee rice, No machine chapathi | Barik set is fine |Lunch | No mandi , No ghee rice, No machine chapathi
| Barik set is fine |Lunch 
Need breakfast & lunch from 3rd Aug 2026 | 2026-09-11 | 2026-08-31 | 2026-09-11 | Followed on 9 sep | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | No mandi , No ghee rice, No machine chapathi | Barik set is fine |Lunch | No mandi , No ghee rice, No machine chapathi
| Barik set is fine |Lunch 
Need breakfast & lunch from 3rd Aug 2026 | 2026-09-11 | 2026-08-31 | 2026-09-11 | Followed on 9 sep | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-438', 'b0000000-0000-0000-0000-000000000001', 'CUST-438', '28', '+971 50 5018502', '28@example.ae', 'bld-113', 'Al wasl H block', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 2 Time , Lunch and Dinner ,Morning Delivery @ 5.45 Cancelled  ❌ | 2026-08-25 | 2026-08-31 | 60 | Followed on 21 aug', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 2 Time , Lunch and Dinner ,Morning Delivery @ 5.45 Cancelled  ❌ | 2026-08-25 | 2026-08-31 | 60 | Followed on 21 aug')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-439', 'b0000000-0000-0000-0000-000000000001', 'CUST-439', '301', '+971 50 7873862', '301@example.ae', 'bld-113', 'Building no 44', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | 1 Time ,Lunch Only ,No Fish and No Beef,Start From 27th July2026  Cancelled ❌ | 2026-08-25 | 2026-08-25 | 0 | Remainder to cancel or to proceed on 25 August | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | 1 Time ,Lunch Only ,No Fish and No Beef,Start From 27th July2026  Cancelled ❌ | 2026-08-25 | 2026-08-25 | 0 | Remainder to cancel or to proceed on 25 August | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-440', 'b0000000-0000-0000-0000-000000000001', 'CUST-440', 'Delna Rose', '+971 50 8996428', 'delnarose@example.ae', 'bld-243', '12', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 Time,Start from 10th July 2026, Cancelled  ❌ | 2026-08-25 | 2026-08-25 | 317 | Followed on 23 August | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 Time,Start from 10th July 2026, Cancelled  ❌ | 2026-08-25 | 2026-08-25 | 317 | Followed on 23 August | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-441', 'b0000000-0000-0000-0000-000000000001', 'CUST-441', 'Ameer', '+971 50 3363907', 'ameer@example.ae', 'bld-244', '101', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 2 Time,Lunch And Dinner,Start From 13th July2026 | 3 times from 3rd Aug 2026 (Monday to Friday only)
Food not required on Saturdays and Sundays | | 2026-08-28 | 2026-07-31 | Ameer: 200 AED received with thanks. (Aug 2026). Balance will be billed at the end of Aug 2026. | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 2 Time,Lunch And Dinner,Start From 13th July2026 | 3 times from 3rd Aug 2026 (Monday to Friday only)
Food not required on Saturdays and Sundays | | 2026-08-28 | 2026-07-31 | Ameer: 200 AED received with thanks. (Aug 2026). Balance will be billed at the end of Aug 2026. | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-442', 'b0000000-0000-0000-0000-000000000001', 'CUST-442', 'Rehna', '+971 50 7684392', 'rehna@example.ae', 'bld-245', '303', 'mp-3-times', true, true, true, 380, 'Running | LN | DN | 2 Time, Lunch and DinnerStart From 1st July2026 | 2026-07-31 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Running | LN | DN | 2 Time, Lunch and DinnerStart From 1st July2026 | 2026-07-31 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-443', 'b0000000-0000-0000-0000-000000000001', 'CUST-443', 'Rakesh', '+971 50 3443186', 'rakesh@example.ae', 'bld-246', '205', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Deliver at 5:30 am | 3 Time  ,Deliver @ 5.30 AmStart from 1st July 2026 | 2026-08-31 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Deliver at 5:30 am | 3 Time  ,Deliver @ 5.30 AmStart from 1st July 2026 | 2026-08-31 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-444', 'b0000000-0000-0000-0000-000000000001', 'CUST-444', 'Nazreen', '+971 50 6213843', 'nazreen@example.ae', 'bld-247', '708', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 times ,Start from 1st Aug 2026✅ | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 times ,Start from 1st Aug 2026✅ | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-445', 'b0000000-0000-0000-0000-000000000001', 'CUST-445', 'Joshrin', '+971 50 4564909', 'joshrin@example.ae', 'bld-247', '708', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 times , Start from 1st Aug 2026✅ | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 times , Start from 1st Aug 2026✅ | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-446', 'b0000000-0000-0000-0000-000000000001', 'CUST-446', 'Sreemol', '+971 50 2201347', 'sreemol@example.ae', 'bld-248', '601', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | no beef and sea food | Start from 12 August 2026✅ no beef and sea food | 2026-08-31 | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | no beef and sea food | Start from 12 August 2026✅ no beef and sea food | 2026-08-31 | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-447', 'b0000000-0000-0000-0000-000000000001', 'CUST-447', 'Ashir Muhammad', '+971 50 5820187', 'ashirmuhammad@example.ae', 'bld-249', '302', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 Times Starting from 13 August 2026✅ | 2026-08-31 | 0 | Followed on 20 August', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 Times Starting from 13 August 2026✅ | 2026-08-31 | 0 | Followed on 20 August')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-448', 'b0000000-0000-0000-0000-000000000001', 'CUST-448', 'Ismail', '+971 50 8776244', 'ismail@example.ae', 'bld-250', '35/11', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 1 Time Lunch and Dinner | 2026-08-31 | 2026-08-31 | 310 | payment before 20 Aug | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 1 Time Lunch and Dinner | 2026-08-31 | 2026-08-31 | 310 | payment before 20 Aug | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-449', 'b0000000-0000-0000-0000-000000000001', 'CUST-449', 'Mirshad', '+971 50 3942617', 'mirshad@example.ae', 'bld-251', '35/11', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | No Fish item,Lunch 12 Pm | 2 Time, Lunch and Dinner,No Fish item,Lunch 12 PmStart From 1st July2026 | 2026-08-31 | 2026-08-31 | 0 | Paid in cash | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | No Fish item,Lunch 12 Pm | 2 Time, Lunch and Dinner,No Fish item,Lunch 12 PmStart From 1st July2026 | 2026-08-31 | 2026-08-31 | 0 | Paid in cash | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-450', 'b0000000-0000-0000-0000-000000000001', 'CUST-450', 'Tintu', '+971 50 3656653', 'tintu@example.ae', 'bld-252', '10', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | No idly,No Beef,Lunch 12 Pm, Don''t deliver fish curry with Chapathi,No Fish curry | 3 Time, All  Day Dinner Chappathi set Start From 2nd July2026,No idly,No Beef,Lunch 12 Pm, Don''t deliver fish curry with Chapathi,No Fish curry🚨🚨🚨🚨 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | No idly,No Beef,Lunch 12 Pm, Don''t deliver fish curry with Chapathi,No Fish curry | 3 Time, All  Day Dinner Chappathi set Start From 2nd July2026,No idly,No Beef,Lunch 12 Pm, Don''t deliver fish curry with Chapathi,No Fish curry🚨🚨🚨🚨 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-451', 'b0000000-0000-0000-0000-000000000001', 'CUST-451', 'Sahad', '+971 50 2441243', 'sahad@example.ae', 'bld-253', '401', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | DN | 2 Time,Breakfast and Dinner ,Start from 11th 2026 | 2026-08-31 | 440 | Followed on 30 August | Bad', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | DN | 2 Time,Breakfast and Dinner ,Start from 11th 2026 | 2026-08-31 | 440 | Followed on 30 August | Bad')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-452', 'b0000000-0000-0000-0000-000000000001', 'CUST-452', 'Aarya', '+971 50 4762061', 'aarya@example.ae', 'bld-254', '5', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | 2 Time,Lunch and Dinner ,Start from 11th 2026, No beef, No porota, No fish curry, Fish fry is fine, Lunch only from 1st Aug 2026🚨,Cancelling on 24th Aug 2026❌ | 2026-08-24 | 2026-08-24 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | 2 Time,Lunch and Dinner ,Start from 11th 2026, No beef, No porota, No fish curry, Fish fry is fine, Lunch only from 1st Aug 2026🚨,Cancelling on 24th Aug 2026❌ | 2026-08-24 | 2026-08-24 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-453', 'b0000000-0000-0000-0000-000000000001', 'CUST-453', 'Sabari', '+971 50 1153101', 'sabari@example.ae', 'bld-244', '101', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | No porota,No rice Dinner,No Fish, No packet chapathi, Need handmade or any other alternative (Monday to Friday only)
Food not required on Saturdays and Sundays | | No porota,No rice Dinner,No Fish, No packet chapathi, Need handmade or any other alternative | 3 times from 3rd Aug 2026 (Monday to Friday only)
Food not required on Saturdays and Sundays | | 2026-08-31 | 0 | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | No porota,No rice Dinner,No Fish, No packet chapathi, Need handmade or any other alternative (Monday to Friday only)
Food not required on Saturdays and Sundays | | No porota,No rice Dinner,No Fish, No packet chapathi, Need handmade or any other alternative | 3 times from 3rd Aug 2026 (Monday to Friday only)
Food not required on Saturdays and Sundays | | 2026-08-31 | 0 | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-454', 'b0000000-0000-0000-0000-000000000001', 'CUST-454', 'Bimal', '+971 50 6969957', 'bimal@example.ae', 'bld-244', '101', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | No Ghee rice | 3 Time,No Ghee rice | 2026-08-31 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | No Ghee rice | 3 Time,No Ghee rice | 2026-08-31 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-455', 'b0000000-0000-0000-0000-000000000001', 'CUST-455', 'Sradha', '+971 50 6703422', 'sradha@example.ae', 'bld-252', '10', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 Time ,Delivery 7.00Am;Start From 15th July2026 | 2026-08-31 | 2026-08-31 | 0 | follwed on 20 aug | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 Time ,Delivery 7.00Am;Start From 15th July2026 | 2026-08-31 | 2026-08-31 | 0 | follwed on 20 aug | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-456', 'b0000000-0000-0000-0000-000000000001', 'CUST-456', 'Rinju', '+971 50 5291678', 'rinju@example.ae', 'bld-255', '103', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Lunch & Dinner ,Delivery 7.00Am | Start From 19th July2026, Cancelling on 30th Aug ❌ | 2026-08-30 | 2026-07-31 | 2026-08-30 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Lunch & Dinner ,Delivery 7.00Am | Start From 19th July2026, Cancelling on 30th Aug ❌ | 2026-08-30 | 2026-07-31 | 2026-08-30 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-457', 'b0000000-0000-0000-0000-000000000001', 'CUST-457', 'Josna', '+971 50 1221438', 'josna@example.ae', 'bld-30', '102', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | DN | Breakfast & dinner,
Start from 2nd Aug 2026✅ | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | DN | Breakfast & dinner,
Start from 2nd Aug 2026✅ | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-458', 'b0000000-0000-0000-0000-000000000001', 'CUST-458', 'Rahil', '+971 50 4834905', 'rahil@example.ae', 'bld-256', '205', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 Time ,Start From 27th July2026 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 Time ,Start From 27th July2026 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-459', 'b0000000-0000-0000-0000-000000000001', 'CUST-459', 'Kural', '+971 50 7503121', 'kural@example.ae', 'bld-257', '209', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Start from 15th Aug 2026✅ | 2026-08-28 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Start from 15th Aug 2026✅ | 2026-08-28 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-460', 'b0000000-0000-0000-0000-000000000001', 'CUST-460', 'Haritha', '+971 50 2067818', 'haritha@example.ae', 'bld-258', '2', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | No porotta needed                                                         Starting from 23 August 2026✅ trail | 2026-08-29 | 0 | Followed on 23 August', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | No porotta needed                                                         Starting from 23 August 2026✅ trail | 2026-08-29 | 0 | Followed on 23 August')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-461', 'b0000000-0000-0000-0000-000000000001', 'CUST-461', 'Aadhil', '+971 50 7819913', 'aadhil@example.ae', 'bld-259', '303', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Deliver at 6:15 | Lunch and dinner Starting from 27 August 2026✅', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Deliver at 6:15 | Lunch and dinner Starting from 27 August 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-462', 'b0000000-0000-0000-0000-000000000001', 'CUST-462', 'Nabhan', '+971 50 6765715', 'nabhan@example.ae', 'bld-260', '110', 'mp-3-times', true, true, true, 380, 'Running | BF | LN | DN | 3 Time | 2026-08-31 | 0 | Bad', '2026-07-01', '2026-07-01', 'left', 'Good', 'Running | BF | LN | DN | 3 Time | 2026-08-31 | 0 | Bad')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-463', 'b0000000-0000-0000-0000-000000000001', 'CUST-463', 'Bijin Babu', '+971 50 6945930', 'bijinbabu@example.ae', 'bld-261', '103', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 Time  ,Morning 6 Am.Evening 6.pm.,No Fish,No Porotta,Start from 1stJuly 2026 | 2026-08-31 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 Time  ,Morning 6 Am.Evening 6.pm.,No Fish,No Porotta,Start from 1stJuly 2026 | 2026-08-31 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-464', 'b0000000-0000-0000-0000-000000000001', 'CUST-464', 'Shibu', '+971 50 9500125', 'shibu@example.ae', 'bld-262', '203', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 Time,6.30am | Please deliver inside the flat | Deliver @ 6:30 am | 2026-08-31 | 393 | followed on 19 august | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 Time,6.30am | Please deliver inside the flat | Deliver @ 6:30 am | 2026-08-31 | 393 | followed on 19 august | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-465', 'b0000000-0000-0000-0000-000000000001', 'CUST-465', 'Althaf', '+971 50 7210122', 'althaf@example.ae', 'bld-109', '16', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 2 Time, Lunch and Dinner,Lunch 12 Pm,Start From 1st July2026 Cancelling on 30th Aug 2026❌ | 2026-08-30 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 2 Time, Lunch and Dinner,Lunch 12 Pm,Start From 1st July2026 Cancelling on 30th Aug 2026❌ | 2026-08-30 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-466', 'b0000000-0000-0000-0000-000000000001', 'CUST-466', 'Javad', '+971 50 2507374', 'javad@example.ae', 'bld-263', '4th Floor', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 1 Time ,Lunch Only  ,Satrt from 4th July 2026,Add dinner also from 1st Aug, Lunch & dinner from 1st Aug 2026 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 1 Time ,Lunch Only  ,Satrt from 4th July 2026,Add dinner also from 1st Aug, Lunch & dinner from 1st Aug 2026 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-467', 'b0000000-0000-0000-0000-000000000001', 'CUST-467', 'Della', '+971 50 4494585', 'della@example.ae', 'bld-264', '301', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | 3 Time,Start From 7th July 2026 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | 3 Time,Start From 7th July 2026 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-468', 'b0000000-0000-0000-0000-000000000001', 'CUST-468', 'Anurag', '+971 50 1523321', 'anurag@example.ae', 'bld-265', '506', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 times, Start from 1st Aug 2026✅ | 2026-08-31 | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 times, Start from 1st Aug 2026✅ | 2026-08-31 | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-469', 'b0000000-0000-0000-0000-000000000001', 'CUST-469', 'Aswin', '+971 50 2662449', 'aswin@example.ae', 'bld-266', '405', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 times,  Start from 2nd Aug 2026✅ | 2026-08-31 | 0 | Followed on 20 Aug | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 times,  Start from 2nd Aug 2026✅ | 2026-08-31 | 0 | Followed on 20 Aug | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-470', 'b0000000-0000-0000-0000-000000000001', 'CUST-470', 'Aleyamma', '+971 50 6766474', 'aleyamma@example.ae', 'bld-30', '102', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Start from 3rd Aug 2026✅ | 1 Sept | 2026-09-01 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Start from 3rd Aug 2026✅ | 1 Sept | 2026-09-01 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-471', 'b0000000-0000-0000-0000-000000000001', 'CUST-471', 'Aparna', '+971 50 1536198', 'aparna@example.ae', 'bld-267', '107', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | Breakfast & Lunch,
Start from 2nd Aug 2026✅ | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | Breakfast & Lunch,
Start from 2nd Aug 2026✅ | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-472', 'b0000000-0000-0000-0000-000000000001', 'CUST-472', 'Shilpa', '+971 50 8436061', 'shilpa@example.ae', 'bld-84', '304', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 2 Time, Lunch and DinnerStart From 1st July2026 | 2026-07-01 | 2026-08-31 | 10 | followed on 19 august | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 2 Time, Lunch and DinnerStart From 1st July2026 | 2026-07-01 | 2026-08-31 | 10 | followed on 19 august | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-473', 'b0000000-0000-0000-0000-000000000001', 'CUST-473', 'Roshina', '+971 50 4260372', 'roshina@example.ae', 'bld-268', 'C12', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | | Deliver @ 5 : 45 am |  Start from 3rd Aug 2026✅ | 2026-09-01 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | | Deliver @ 5 : 45 am |  Start from 3rd Aug 2026✅ | 2026-09-01 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-474', 'b0000000-0000-0000-0000-000000000001', 'CUST-474', 'Anand', '+971 50 6512129', 'anand@example.ae', 'bld-107', '', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | Lunch : Half rice+Chapathi | Wednesday: Deliver at Famous Cafeteria- Room 103-P13                   Lunch : Half rice+Chapathi
Start from 19th Aug 2026✅ | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | Lunch : Half rice+Chapathi | Wednesday: Deliver at Famous Cafeteria- Room 103-P13                   Lunch : Half rice+Chapathi
Start from 19th Aug 2026✅ | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-475', 'b0000000-0000-0000-0000-000000000001', 'CUST-475', 'Suhair', '+971 50 9476664', 'suhair@example.ae', 'bld-55', '107', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Start from 6 August 2026✅ | 2026-09-05 | 0 | Followed on 3 sep | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Start from 6 August 2026✅ | 2026-09-05 | 0 | Followed on 3 sep | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-476', 'b0000000-0000-0000-0000-000000000001', 'CUST-476', 'Shuhaib', '+971 50 9992751', 'shuhaib@example.ae', 'bld-269', '35', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Deliver @ 5:45 | Starting from 24 August 2026✅ | 2026-09-23 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Deliver @ 5:45 | Starting from 24 August 2026✅ | 2026-09-23 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-477', 'b0000000-0000-0000-0000-000000000001', 'CUST-477', 'Deepika', '+971 50 3306517', 'deepika@example.ae', 'bld-270', '107', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | No Idli, Pathiri, beef, mutton, chicken biriyani, ghee rice | Starting from 2 September 2026 ✅', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | No Idli, Pathiri, beef, mutton, chicken biriyani, ghee rice | Starting from 2 September 2026 ✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-478', 'b0000000-0000-0000-0000-000000000001', 'CUST-478', 'Neepa', '+971 50 9902746', 'neepa@example.ae', 'bld-271', '1', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | DN | No dosa and kubus need chapati | 2 Time, Breakfast and Dinner,Start From 29th June 2026 | 2026-08-12 | 10 Sept 2026 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | DN | No dosa and kubus need chapati | 2 Time, Breakfast and Dinner,Start From 29th June 2026 | 2026-08-12 | 10 Sept 2026 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-479', 'b0000000-0000-0000-0000-000000000001', 'CUST-479', 'Safana', '+971 50 1396862', 'safana@example.ae', 'bld-272', '10', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | 1 Time ,Lunch Only | 2026-08-31 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | 1 Time ,Lunch Only | 2026-08-31 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-480', 'b0000000-0000-0000-0000-000000000001', 'CUST-480', 'Salman', '+971 50 6417401', 'salman@example.ae', 'bld-77', '210', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Lunch at morning | 2 Time, Lunch and Dinner,Start From 1st July2026, Deliver on the table inside the flat | 2026-09-07 | 80 | Followed on 21 aug | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Lunch at morning | 2 Time, Lunch and Dinner,Start From 1st July2026, Deliver on the table inside the flat | 2026-09-07 | 80 | Followed on 21 aug | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-481', 'b0000000-0000-0000-0000-000000000001', 'CUST-481', 'Greeshna', '+971 50 6817085', 'greeshna@example.ae', 'bld-273', '301', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | Deliver @ noon | Lunch only Deliver @ noon  Start from 14th Aug 2026✅ | 2026-09-12 | 2026-09-12 | 0 | will do payment after 15 days | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | Deliver @ noon | Lunch only Deliver @ noon  Start from 14th Aug 2026✅ | 2026-09-12 | 2026-09-12 | 0 | will do payment after 15 days | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-482', 'b0000000-0000-0000-0000-000000000001', 'CUST-482', 'Sijo Photographer', '+971 50 3977184', 'sijophotographer@example.ae', 'bld-274', '301', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 2 Time ,Lunch & Dinner,No Ghee Rice | 2026-09-12 | 2026-08-31 | 0 | Bad', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 2 Time ,Lunch & Dinner,No Ghee Rice | 2026-09-12 | 2026-08-31 | 0 | Bad')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-483', 'b0000000-0000-0000-0000-000000000001', 'CUST-483', 'Jidin', '+971 50 4667887', 'jidin@example.ae', 'bld-275', '208', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Starting from 1 September 2026 ✅ | 0', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Starting from 1 September 2026 ✅ | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-484', 'b0000000-0000-0000-0000-000000000001', 'CUST-484', 'Bindu', '+971 50 1032158', 'bindu@example.ae', 'bld-276', '403', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Restarting from 17 August 2026 | 2026-09-15 | 2026-09-15 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Restarting from 17 August 2026 | 2026-09-15 | 2026-09-15 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-485', 'b0000000-0000-0000-0000-000000000001', 'CUST-485', 'Prashob', '+971 50 1234393', 'prashob@example.ae', 'bld-277', '201', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Starting from 8 September 2026✅ | 2026-09-14 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Starting from 8 September 2026✅ | 2026-09-14 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-486', 'b0000000-0000-0000-0000-000000000001', 'CUST-486', 'Thamanna', '+971 50 6916613', 'thamanna@example.ae', 'bld-102', '303', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Starting from 1 September 2026 ✅ | 2026-09-20 | 2026-09-30', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Starting from 1 September 2026 ✅ | 2026-09-20 | 2026-09-30')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-487', 'b0000000-0000-0000-0000-000000000001', 'CUST-487', 'Raj', '+971 50 7962929', 'raj@example.ae', 'bld-278', '107', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Start from 18 August 2026✅ Current location will change on 31 August | 2026-09-20 | 2026-09-19 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Start from 18 August 2026✅ Current location will change on 31 August | 2026-09-20 | 2026-09-19 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-488', 'b0000000-0000-0000-0000-000000000001', 'CUST-488', 'Ebin', '+971 50 7790660', 'ebin@example.ae', 'bld-279', '306', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Starting from 14 September 2026✅ | 2026-09-20 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Starting from 14 September 2026✅ | 2026-09-20 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-489', 'b0000000-0000-0000-0000-000000000001', 'CUST-489', 'Joyal', '+971 50 7438215', 'joyal@example.ae', 'bld-55', '107', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Start from 31 August 2026✅ | 2026-09-06 | 2026-09-30 | 290 | Followed on 18 sep', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Start from 31 August 2026✅ | 2026-09-06 | 2026-09-30 | 290 | Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-490', 'b0000000-0000-0000-0000-000000000001', 'CUST-490', 'Sainul', '+971 50 3733379', 'sainul@example.ae', 'bld-41', 'C 1', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | 1 Time,Lunch Only,Start from 9th 2026 | July | 2026-09-30 | 206 | Followed on 18 sep | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | 1 Time,Lunch Only,Start from 9th 2026 | July | 2026-09-30 | 206 | Followed on 18 sep | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-491', 'b0000000-0000-0000-0000-000000000001', 'CUST-491', 'Aby', '+971 50 4935755', 'aby@example.ae', 'bld-280', '109', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | No pathiri need Chapathi MONDAY,TUESDAY ,WENDSDAY,THURSDAY: Lunch and Dinner
FRIDAY : Dinner only 
Saturday: Breakfast, Lunch, Dinner
SUNDAY: Dinner only | 2 Time,Lunch And Dinner,Start From 13th July2026  No pathiri need Chapathi | 2026-09-11 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | No pathiri need Chapathi MONDAY,TUESDAY ,WENDSDAY,THURSDAY: Lunch and Dinner
FRIDAY : Dinner only 
Saturday: Breakfast, Lunch, Dinner
SUNDAY: Dinner only | 2 Time,Lunch And Dinner,Start From 13th July2026  No pathiri need Chapathi | 2026-09-11 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-492', 'b0000000-0000-0000-0000-000000000001', 'CUST-492', 'Akshaya', '+971 50 6675425', 'akshaya@example.ae', 'bld-95', '101', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | Start from 22nd Sep 2026✅ | 2026-09-29 | 48', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | Start from 22nd Sep 2026✅ | 2026-09-29 | 48')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-493', 'b0000000-0000-0000-0000-000000000001', 'CUST-493', 'Agneya', '+971 50 7772290', 'agneya@example.ae', 'bld-281', '101', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Start from 22nd Sep 2026✅ | 2026-09-28 | 90', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Start from 22nd Sep 2026✅ | 2026-09-28 | 90')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-494', 'b0000000-0000-0000-0000-000000000001', 'CUST-494', 'Vignesh', '+971 50 1306903', 'vignesh@example.ae', 'bld-57', '2 C', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | No soyabean | 3 Time (Pure veg) Re Start from tomorrow 2nd October 2026✅ | 2026-10-04 | 39 | Followed on 18 sep | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | No soyabean | 3 Time (Pure veg) Re Start from tomorrow 2nd October 2026✅ | 2026-10-04 | 39 | Followed on 18 sep | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-495', 'b0000000-0000-0000-0000-000000000001', 'CUST-495', 'Biju', '+971 50 4130074', 'biju@example.ae', 'bld-282', '409', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | 3 Time , 6.30 Am ,Lunch ,No Idly | 2026-09-30 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | 3 Time , 6.30 Am ,Lunch ,No Idly | 2026-09-30 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-496', 'b0000000-0000-0000-0000-000000000001', 'CUST-496', 'Shamnad', '+971 50 4022819', 'shamnad@example.ae', 'bld-283', '2026-04-05', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 2 times | 2026-09-30 | 2026-10-01 | 10 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 2 times | 2026-09-30 | 2026-10-01 | 10 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-497', 'b0000000-0000-0000-0000-000000000001', 'CUST-497', 'chithu', '+971 50 1437939', 'chithu@example.ae', 'bld-284', '303', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Deliver @6.45 Am,Saturday Lunch ,No Pathiri | 3 Time  , Deliver @6.45 Am,Saturday Lunch ,No Pathiri,Start from 2nd July 2026 | 2026-09-30 | 2026-10-01 | 10 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Deliver @6.45 Am,Saturday Lunch ,No Pathiri | 3 Time  , Deliver @6.45 Am,Saturday Lunch ,No Pathiri,Start from 2nd July 2026 | 2026-09-30 | 2026-10-01 | 10 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-498', 'b0000000-0000-0000-0000-000000000001', 'CUST-498', 'Shahin', '+971 50 1085849', 'shahin@example.ae', 'bld-285', 'R301', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | DN | Deliver @5.30 Am | 2 Time,Breakfast and Lunch Start From 3th July2026,Deliver @5.30 Am | 2026-09-30 | 2026-08-25 | 2026-09-23 | 300 | Followed on 18 sep | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | DN | Deliver @5.30 Am | 2 Time,Breakfast and Lunch Start From 3th July2026,Deliver @5.30 Am | 2026-09-30 | 2026-08-25 | 2026-09-23 | 300 | Followed on 18 sep | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-499', 'b0000000-0000-0000-0000-000000000001', 'CUST-499', 'Akhila', '+971 50 9503675', 'akhila@example.ae', 'bld-286', '303', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | Morning Delivery 6.00 Am | 2 Time Lunch and Dinner,Morning Delivery 6.00 Am,Dinner 6.30 Pm start From 5th July02026 | 2026-08-31 | 2026-09-30 | 180 | Followed on 11 sep will pay by 30 Sep', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | Morning Delivery 6.00 Am | 2 Time Lunch and Dinner,Morning Delivery 6.00 Am,Dinner 6.30 Pm start From 5th July02026 | 2026-08-31 | 2026-09-30 | 180 | Followed on 11 sep will pay by 30 Sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-500', 'b0000000-0000-0000-0000-000000000001', 'CUST-500', 'IRSHAD', '+971 50 8153801', 'irshad@example.ae', 'bld-78', '102', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 2 Times,Lunch and Dinner, Deliver Before 6 AM                                                                                                           Start from 30th July 2026 | 2026-09-30 | 300 | Followed on 18 sep | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 2 Times,Lunch and Dinner, Deliver Before 6 AM                                                                                                           Start from 30th July 2026 | 2026-09-30 | 300 | Followed on 18 sep | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-501', 'b0000000-0000-0000-0000-000000000001', 'CUST-501', 'Faris', '+971 50 1156721', 'faris@example.ae', 'bld-263', '205', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 2 Time,Lunch And Dinner,Start From 23rd July2026 | 2026-08-21 | 2026-10-03 | 0 | 25 | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 2 Time,Lunch And Dinner,Start From 23rd July2026 | 2026-08-21 | 2026-10-03 | 0 | 25 | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-502', 'b0000000-0000-0000-0000-000000000001', 'CUST-502', 'Diya', '+971 50 5392781', 'diya@example.ae', 'bld-26', '215', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Starting from 1 September 2026 ✅ | 2026-09-30 | 2026-10-04 | 40', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Starting from 1 September 2026 ✅ | 2026-09-30 | 2026-10-04 | 40')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-503', 'b0000000-0000-0000-0000-000000000001', 'CUST-503', 'Amrutha', '+971 50 3062626', 'amrutha@example.ae', 'bld-287', '301', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | Morning Delivery 6.30 Am,No Fish curry for Lunch | 2 Time Breakfast and Lunch,Morning Delivery 6.30 Am,No Fish curry for Lunch, start From 6th July02026 | 3 Sept 2026 | 2026-10-02 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | Morning Delivery 6.30 Am,No Fish curry for Lunch | 2 Time Breakfast and Lunch,Morning Delivery 6.30 Am,No Fish curry for Lunch, start From 6th July02026 | 3 Sept 2026 | 2026-10-02 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-504', 'b0000000-0000-0000-0000-000000000001', 'CUST-504', 'Sneha', '+971 50 9695420', 'sneha@example.ae', 'bld-33', '302', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Deliver @ 5:45 AM | Start from 1st October 2026✅', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Deliver @ 5:45 AM | Start from 1st October 2026✅')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-505', 'b0000000-0000-0000-0000-000000000001', 'CUST-505', 'Akbar', '+971 50 2876956', 'akbar@example.ae', 'bld-288', '6', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | No Fish items | Starting from 8 September 2026✅ Cancelled on 5 oct | 2026-10-01', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | No Fish items | Starting from 8 September 2026✅ Cancelled on 5 oct | 2026-10-01')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-506', 'b0000000-0000-0000-0000-000000000001', 'CUST-506', 'Shajeer', '+971 50 1742389', 'shajeer@example.ae', 'bld-289', '31', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Deliver @ 6:15 AM | Start from 1st Oct 2026✅ 5265#
cancel on 8 oct', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Deliver @ 6:15 AM | Start from 1st Oct 2026✅ 5265#
cancel on 8 oct')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-507', 'b0000000-0000-0000-0000-000000000001', 'CUST-507', 'Manoj', '+971 50 3970835', 'manoj@example.ae', 'bld-290', '202', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | 2 Time,Lunch & Dinner | 2026-08-31 | 1680 | Followed on 18 sep | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | 2 Time,Lunch & Dinner | 2026-08-31 | 1680 | Followed on 18 sep | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-508', 'b0000000-0000-0000-0000-000000000001', 'CUST-508', 'Thahir G', '+971 50 2698159', 'thahirg@example.ae', 'bld-291', '204', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Start from 21st Sep 2026✅ cancelled on oct 10', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Start from 21st Sep 2026✅ cancelled on oct 10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-509', 'b0000000-0000-0000-0000-000000000001', 'CUST-509', 'Arshad', '+971 50 4354647', 'arshad@example.ae', 'bld-292', '6', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Lunch 12 Pm, Barik Rice | 2 Time , Lunch and Dinner,Lunch 12 Pm, Barik Rice | Cancelling on 10th Oct❌ | 2026-09-30 | 2026-10-10 | 0 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Lunch 12 Pm, Barik Rice | 2 Time , Lunch and Dinner,Lunch 12 Pm, Barik Rice | Cancelling on 10th Oct❌ | 2026-09-30 | 2026-10-10 | 0 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-510', 'b0000000-0000-0000-0000-000000000001', 'CUST-510', 'Thahir K', '+971 50 6233397', 'thahirk@example.ae', 'bld-293', '33', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Start from 7th Oct 2026✅ cancelled on 15 oct', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Start from 7th Oct 2026✅ cancelled on 15 oct')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-511', 'b0000000-0000-0000-0000-000000000001', 'CUST-511', 'Abhishek', '+971 50 7695347', 'abhishek@example.ae', 'bld-97', '302', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Lunch 12 Pm,No Poori,No Porota,No Fish | 2 Time,Lunch and  Dinner ,Lunch 12 Pm,No Poori,No Porota,No Fish,Start from 8th July 2026 Cancelling on 15 october. | 2026-09-30 | 2026-10-15 | 150 | Late payer', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Lunch 12 Pm,No Poori,No Porota,No Fish | 2 Time,Lunch and  Dinner ,Lunch 12 Pm,No Poori,No Porota,No Fish,Start from 8th July 2026 Cancelling on 15 october. | 2026-09-30 | 2026-10-15 | 150 | Late payer')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-512', 'b0000000-0000-0000-0000-000000000001', 'CUST-512', 'Ahalya', '+971 50 2835771', 'ahalya@example.ae', 'bld-294', '101', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Cancelling on 18th Oct 2026❌ | Starting from 25 August 2026✅ | 2026-08-24 | 2026-10-31 | 697', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Cancelling on 18th Oct 2026❌ | Starting from 25 August 2026✅ | 2026-08-24 | 2026-10-31 | 697')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-513', 'b0000000-0000-0000-0000-000000000001', 'CUST-513', 'Sobin', '+971 50 8724106', 'sobin@example.ae', 'bld-295', '204', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Deliver @ 6:30 AM | 3 times Deliver @ 6:30 AM Starting from 6th Jan 2026 Cancelled on 22 October | 2026-08-31 | 2026-10-22 | 659 | Co Gokul | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Deliver @ 6:30 AM | 3 times Deliver @ 6:30 AM Starting from 6th Jan 2026 Cancelled on 22 October | 2026-08-31 | 2026-10-22 | 659 | Co Gokul | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-514', 'b0000000-0000-0000-0000-000000000001', 'CUST-514', 'Tom', '+971 50 4142585', 'tom@example.ae', 'bld-21', '310', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Deliver @ 6 AM | Start from 15th Oct 2026✅ | 2026-10-22 | 91', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Deliver @ 6 AM | Start from 15th Oct 2026✅ | 2026-10-22 | 91')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-515', 'b0000000-0000-0000-0000-000000000001', 'CUST-515', 'Soorya', '+971 50 6761830', 'soorya@example.ae', 'bld-50', 'Flat 104', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | Deliver @ 6:00 am,             No Beef | Deliver @ 6:00 am
Breakfast & lunch,No Beef
Starting from 4th Feb Lunch only from 1 Oct 2026 | 2026-09-30 | 31 October 0206 | 132 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | Deliver @ 6:00 am,             No Beef | Deliver @ 6:00 am
Breakfast & lunch,No Beef
Starting from 4th Feb Lunch only from 1 Oct 2026 | 2026-09-30 | 31 October 0206 | 132 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-516', 'b0000000-0000-0000-0000-000000000001', 'CUST-516', 'Subin', '+971 50 8533173', 'subin@example.ae', 'bld-296', '405', 'mp-3-times', true, true, true, 380, 'Cancelled | LN | DN | Cancel on 20th October 2026❌ | 2 Time, Lunch and DinnerStart From 1st July2026 Cancelling on 20 oct | 2026-09-30 | 2026-10-20 | 50 | Good', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | LN | DN | Cancel on 20th October 2026❌ | 2 Time, Lunch and DinnerStart From 1st July2026 Cancelling on 20 oct | 2026-09-30 | 2026-10-20 | 50 | Good')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-517', 'b0000000-0000-0000-0000-000000000001', 'CUST-517', 'Sayana', '+971 50 8851723', 'sayana@example.ae', 'bld-297', '205', 'mp-3-times', true, true, true, 380, 'Cancelled | BF | LN | DN | Cancel on 21 october 2026 ❌ | Start from 5th Oct 2026✅ | 2026-10-19 | 2026-10-19 | 0', '2026-07-01', '2026-07-01', 'left', 'Good', 'Cancelled | BF | LN | DN | Cancel on 21 october 2026 ❌ | Start from 5th Oct 2026✅ | 2026-10-19 | 2026-10-19 | 0')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-518', 'b0000000-0000-0000-0000-000000000001', 'CUST-518', 'Status', '+971 50 4924076', 'status@example.ae', 'bld-298', 'Building', 'mp-3-times', true, true, true, 380, 'End | Days | Amount', '2026-07-01', '2026-07-01', 'left', 'Good', 'End | Days | Amount')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-519', 'b0000000-0000-0000-0000-000000000001', 'CUST-519', 'Stopped', '+971 50 8258156', 'stopped@example.ae', 'bld-299', 'Star of Karama', 'mp-3-times', true, true, true, 380, '2026-10-06 | 19 | 247', '2026-07-01', '2026-07-01', 'left', 'Good', '2026-10-06 | 19 | 247')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-520', 'b0000000-0000-0000-0000-000000000001', 'CUST-520', 'Shop', '+971 50 7665969', 'shop@example.ae', 'bld-300', '', 'mp-3-times', true, true, true, 380, '0 | 1 | 1 | 2 Time | 470', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 1 | 2 Time | 470')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-521', 'b0000000-0000-0000-0000-000000000001', 'CUST-521', '404', '+971 50 1479002', '404@example.ae', 'bld-301', '', 'mp-3-times', true, true, true, 380, '0 | 1 | 1 | Lunch & dinner
Starting from 1st Jan 2026 | The address is changing from 2nd Feb | deliver in the kitchen | 380', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 1 | 1 | Lunch & dinner
Starting from 1st Jan 2026 | The address is changing from 2nd Feb | deliver in the kitchen | 380')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-522', 'b0000000-0000-0000-0000-000000000001', 'CUST-522', '13', '+971 50 4291282', '13@example.ae', 'bld-205', '', 'mp-3-times', true, true, true, 380, '1 | 1 | 1 | 3 Time | 13', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 1 | 3 Time | 13')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-523', 'b0000000-0000-0000-0000-000000000001', 'CUST-523', '203', '+971 50 5755018', '203@example.ae', 'bld-302', 'Old lootha building', 'mp-3-times', true, true, true, 380, '0 | 1 | 1 | Deliver on top of the refrigerator - Lunch & Dinner from 9th Dec 2025 | 210 | 306 | -306 | 240 | -66 | 170 | 104', '2026-07-01', '2026-07-01', 'left', 'Late payer', '0 | 1 | 1 | Deliver on top of the refrigerator - Lunch & Dinner from 9th Dec 2025 | 210 | 306 | -306 | 240 | -66 | 170 | 104')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-524', 'b0000000-0000-0000-0000-000000000001', 'CUST-524', '102', '+971 50 3183320', '102@example.ae', 'bld-303', '', 'mp-3-times', true, true, true, 380, '1 | 1 | 1 | 3 Time | 40', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 1 | 3 Time | 40')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-525', 'b0000000-0000-0000-0000-000000000001', 'CUST-525', 'Nijam', '+971 50 4850282', 'nijam@example.ae', 'bld-304', 'Shop', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,Lunch & Dinner,Lunch Barik 12 Pm | 30', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,Lunch & Dinner,Lunch Barik 12 Pm | 30')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-526', 'b0000000-0000-0000-0000-000000000001', 'CUST-526', 'Joel', '+971 50 7651394', 'joel@example.ae', 'bld-115', '404', 'mp-3-times', true, true, true, 380, '1 | 0 | 1 Time ,Lunch CP | 36', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 0 | 1 Time ,Lunch CP | 36')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-527', 'b0000000-0000-0000-0000-000000000001', 'CUST-527', 'Nowshad', '+971 50 9362788', 'nowshad@example.ae', 'bld-131', '304', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time | 388', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time | 388')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-528', 'b0000000-0000-0000-0000-000000000001', 'CUST-528', 'Shibili', '+971 50 4056210', 'shibili@example.ae', 'bld-305', '32', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time,2 Time. Lunch & Dinner | 10', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time,2 Time. Lunch & Dinner | 10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-529', 'b0000000-0000-0000-0000-000000000001', 'CUST-529', 'Pratheeksha Co Arathy', '+971 50 6268000', 'pratheekshacoarathy@example.ae', 'bld-171', '405', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time | 70', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time | 70')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-530', 'b0000000-0000-0000-0000-000000000001', 'CUST-530', 'Sreekanth', '+971 50 4928263', 'sreekanth@example.ae', 'bld-115', '404', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time | 36', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time | 36')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-531', 'b0000000-0000-0000-0000-000000000001', 'CUST-531', 'Rency', '+971 50 2076530', 'rency@example.ae', 'bld-306', '303', 'mp-3-times', true, true, true, 380, '0 | 0 | 2 breakfasts | 10', '2026-07-01', '2026-07-01', 'left', 'Good', '0 | 0 | 2 breakfasts | 10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-532', 'b0000000-0000-0000-0000-000000000001', 'CUST-532', 'Swaliha', '+971 50 8589234', 'swaliha@example.ae', 'bld-307', '302', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time , Lunch and Dinner,No Beef,No Porota | 0 | 10', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time , Lunch and Dinner,No Beef,No Porota | 0 | 10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-533', 'b0000000-0000-0000-0000-000000000001', 'CUST-533', 'Adharsh', '+971 50 4192954', 'adharsh@example.ae', 'bld-308', '304', 'mp-3-times', true, true, true, 380, '1 | 1 | 2 Time Lunch and Dinner | 60', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 2 Time Lunch and Dinner | 60')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-534', 'b0000000-0000-0000-0000-000000000001', 'CUST-534', 'Pranav', '+971 50 6707197', 'pranav@example.ae', 'bld-309', '308', 'mp-3-times', true, true, true, 380, '1 | 1 | 3 Time | 50', '2026-07-01', '2026-07-01', 'left', 'Good', '1 | 1 | 3 Time | 50')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-535', 'b0000000-0000-0000-0000-000000000001', 'CUST-535', 'PH Number', '+971 50 5081337', 'phnumber@example.ae', 'bld-298', 'Address', 'mp-3-times', true, true, true, 380, 'Due', '2026-07-01', '2026-07-01', 'left', 'Good', 'Due')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.customers (id, business_id, customer_code, full_name, phone, email, building_id, apartment, meal_plan_id, has_breakfast, has_lunch, has_dinner, monthly_price, dietary_preferences, joining_date, billing_start_date, status, payment_rating, notes)
VALUES ('c-thahir-corp', 'b0000000-0000-0000-0000-000000000001', 'CORP-THAHIR', 'Thahir Group Corporate Account', '+971 50 999 8877', 'thahir.corp@karamamess.ae', 'bld-310', 'Multiple', 'mp-3-times', true, true, true, 2203, 'Corporate Group Catering (11 staff members: Thahir A - K)', '2026-09-18', '2026-09-18', 'active', 'Late payer', 'Total: AED 2,203 | Paid: AED 1,300 (4 installments) | Overdue Balance: AED 903')
ON CONFLICT (id) DO NOTHING;

-- 3. INVOICESINSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1001', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1001', 'c-101', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 250, 250, 0, 250, 'overdue', 'Payment remark: Dues will clear by Nov beginning')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1002', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1002', 'c-106', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Payment remark: Followed on 9 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1003', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1003', 'c-107', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 393, 393, 0, 393, 'overdue', 'Payment remark: Followed on 9 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1004', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1004', 'c-108', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Payment remark: Followed on 9 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1005', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1005', 'c-109', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 393, 393, 0, 393, 'overdue', 'Payment remark: Followed on 9 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1006', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1006', 'c-110', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 204, 204, 0, 204, 'overdue', 'Payment remark: Oct month balance 204 & Nov month 380 will be paid in the 1st week of Nov 202')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1007', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1007', 'c-114', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1008', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1008', 'c-117', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 270, 270, 0, 270, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1009', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1009', 'c-118', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 10, 10, 0, 10, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1010', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1010', 'c-120', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 217, 217, 0, 217, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1011', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1011', 'c-121', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 130, 130, 0, 130, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1012', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1012', 'c-122', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1013', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1013', 'c-123', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1014', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1014', 'c-125', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 110, 110, 0, 110, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1015', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1015', 'c-126', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 150, 150, 0, 150, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1016', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1016', 'c-128', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 361, 361, 0, 361, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1017', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1017', 'c-129', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 10, 10, 0, 10, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1018', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1018', 'c-130', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 180, 180, 0, 180, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1019', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1019', 'c-131', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 130, 130, 0, 130, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1020', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1020', 'c-132', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 130, 130, 0, 130, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1021', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1021', 'c-133', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 130, 130, 0, 130, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1022', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1022', 'c-134', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 300, 300, 0, 300, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1023', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1023', 'c-135', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 10, 10, 0, 10, 'overdue', 'Payment remark: 10')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1024', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1024', 'c-138', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 186, 186, 0, 186, 'overdue', 'Payment remark: 216 will pay on Oct 11th & Balance will do by Oct last')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1025', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1025', 'c-139', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 20, 20, 0, 20, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1026', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1026', 'c-141', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 117, 117, 0, 117, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1027', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1027', 'c-146', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 380, 380, 0, 380, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1028', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1028', 'c-147', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1029', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1029', 'c-150', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 132, 132, 0, 132, 'overdue', 'Payment remark: followed on 3 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1030', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1030', 'c-151', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 132, 132, 0, 132, 'overdue', 'Payment remark: followed on 3 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1031', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1031', 'c-154', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1032', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1032', 'c-156', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 220, 220, 0, 220, 'overdue', 'Payment remark: 70 Aed Paid')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1033', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1033', 'c-158', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 340, 340, 0, 340, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1034', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1034', 'c-162', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 186, 186, 0, 186, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1035', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1035', 'c-165', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 186, 186, 0, 186, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1036', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1036', 'c-167', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 380, 380, 0, 380, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1037', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1037', 'c-168', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 300, 300, 0, 300, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1038', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1038', 'c-169', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 10, 10, 0, 10, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1039', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1039', 'c-170', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 300, 300, 0, 300, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1040', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1040', 'c-173', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1041', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1041', 'c-176', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 440, 440, 0, 440, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1042', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1042', 'c-179', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 300, 300, 0, 300, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1043', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1043', 'c-183', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 300, 300, 0, 300, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1044', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1044', 'c-184', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 210, 210, 0, 210, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1045', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1045', 'c-185', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 96, 96, 0, 96, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1046', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1046', 'c-186', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 230, 230, 0, 230, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1047', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1047', 'c-192', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 394, 394, 0, 394, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1048', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1048', 'c-193', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1049', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1049', 'c-195', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 610, 610, 0, 610, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1050', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1050', 'c-198', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 610, 610, 0, 610, 'overdue', 'Payment remark: Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1051', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1051', 'c-199', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 300, 300, 0, 300, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1052', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1052', 'c-201', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 180, 180, 0, 180, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1053', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1053', 'c-204', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 30, 30, 0, 30, 'overdue', 'Payment remark: 150 Paid')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1054', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1054', 'c-207', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 610, 610, 0, 610, 'overdue', 'Payment remark: Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1055', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1055', 'c-209', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1056', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1056', 'c-210', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 358, 358, 0, 358, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1057', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1057', 'c-211', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 1150, 1150, 0, 1150, 'overdue', 'Payment remark: Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1058', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1058', 'c-212', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 600, 600, 0, 600, 'overdue', 'Payment remark: Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1059', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1059', 'c-213', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 300, 300, 0, 300, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1060', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1060', 'c-214', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1061', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1061', 'c-215', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1062', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1062', 'c-216', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1063', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1063', 'c-217', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1064', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1064', 'c-218', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 600, 600, 0, 600, 'overdue', 'Payment remark: Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1065', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1065', 'c-219', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 390, 390, 0, 390, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1066', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1066', 'c-221', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 10, 10, 0, 10, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1067', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1067', 'c-225', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 280, 280, 0, 280, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1068', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1068', 'c-226', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 10, 10, 0, 10, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1069', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1069', 'c-227', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1070', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1070', 'c-230', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 60, 60, 0, 60, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1071', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1071', 'c-231', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 670, 670, 0, 670, 'overdue', 'Payment remark: Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1072', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1072', 'c-238', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 60, 60, 0, 60, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1073', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1073', 'c-239', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 610, 610, 0, 610, 'overdue', 'Payment remark: Followed on 18 sep')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1074', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1074', 'c-242', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 10, 10, 0, 10, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1075', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1075', 'c-253', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1076', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1076', 'c-255', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 186, 186, 0, 186, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1077', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1077', 'c-258', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 310, 310, 0, 310, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1078', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1078', 'c-261', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 456, 456, 0, 456, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1079', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1079', 'c-262', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 186, 186, 0, 186, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1080', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1080', 'c-263', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 60, 60, 0, 60, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1081', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1081', 'c-264', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 150, 150, 0, 150, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1082', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1082', 'c-265', '2026-10-01', '2026-10-15', '2026-10-01', '2026-10-31', 200, 200, 0, 200, 'overdue', 'Monthly mess dues')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1083', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1083', 'c-270', '2026-08-01', '2026-08-15', '2026-08-01', '2026-08-31', 130, 130, 0, 130, 'overdue', 'Pending settlement: 13 | 2 | 130')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1084', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1084', 'c-271', '2026-08-01', '2026-08-15', '2026-08-01', '2026-08-31', 130, 130, 0, 130, 'overdue', 'Pending settlement: 10 | 3 | 130')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1085', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1085', 'c-401', '2026-08-01', '2026-08-15', '2026-08-01', '2026-08-31', 2026, 2026, 0, 2026, 'overdue', 'Pending settlement: 1 | 0 | Lunch only, Start from 3rd Aug 2026✅ Cance')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1086', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1086', 'c-523', '2026-08-01', '2026-08-15', '2026-08-01', '2026-08-31', 104, 104, 0, 104, 'overdue', 'Pending settlement: 0 | 1 | 1 | Deliver on top of the refrigerator - L')
ON CONFLICT (id) DO NOTHING;
INSERT INTO public.invoices (id, business_id, invoice_number, customer_id, issue_date, due_date, period_start, period_end, subtotal, total_amount, paid_amount, balance_amount, status, notes)
VALUES ('inv-1087', 'b0000000-0000-0000-0000-000000000001', 'INV-2026-1087', 'c-thahir-corp', '2026-10-06', '2026-10-20', '2026-09-18', '2026-10-21', 2203, 2203, 1300, 903, 'partially_paid', 'Thahir Corporate account: 11 staff catering. AED 1,300 paid in 4 parts. Overdue AED 903.')
ON CONFLICT (id) DO NOTHING;

COMMIT;
