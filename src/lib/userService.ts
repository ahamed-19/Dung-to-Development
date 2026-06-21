import { supabase } from './supabase'
import QRCode from "qrcode";

export async function createUser(
  name: string,
  age: number,
  address: string,
  phone_no: string,
  role: string,
  password: string
) {
  // Insert user first
  const { data, error } = await supabase
    .from("app_user")
    .insert([
      {
        name,
        age,
        address,
        phone_no,
        role,
        password,
      },
    ])
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }

  // Generate QR code only for House Owners
  if (role === "houseOwner") {
    const qrCode = await QRCode.toDataURL(
      `HOUSE:${data.id}`
    );

    const { error: updateError } = await supabase
      .from("app_user")
      .update({
        qr_code: qrCode,
      })
      .eq("id", data.id);

    if (updateError) {
      console.log("QR UPDATE ERROR:", updateError);
    }
  }

  return { data, error: null };
}
export async function loginUser(
  name: string,
  password: string
) {
  const { data, error } = await supabase
    .from('app_user')
    .select('*')
    .eq('name', name)
    .eq('password', password)
    .single()

  return { data, error }
}
export async function getAllUsers() {
  const { data, error } = await supabase
    .from("app_user")
    .select("*");

  return { data, error };
}
export async function getHouseOwners() {
  const { data, error } = await supabase
    .from("app_user")
    .select("*")
    .eq("role", "houseOwner");

  return { data, error };
}
export async function getWorkers() {
  const { data, error } = await supabase
    .from("app_user")
    .select("*")
    .eq("role", "worker");

  return { data, error };
}

export async function createHouseOwner(
  name: string,
  address: string,
  phone_no: string
) {
  const { data, error } = await supabase
    .from("app_user")
    .insert([
      {
        name,
        address,
        phone_no,
        age: 0,
        role: "houseOwner",
      },
    ])
    .select()
    .single();

  if (error) {
    return { data: null, error };
  }
  console.log("INSERT DATA:", data);
  console.log("INSERT ERROR:", error);
  const houseId = data.id;
  console.log("HOUSE ID:", houseId);

  const qrCode = await QRCode.toDataURL(
    `HOUSE:${houseId}`
  );
  console.log("QR GENERATED");


const { data: updateData, error: updateError } =
  await supabase
    .from("app_user")
    .update({
      qr_code: qrCode,
    })
    .eq("id", houseId)
    .select();

console.log("UPDATE DATA:", updateData);
console.log("UPDATE ERROR:", updateError);
  return { data, error: null };
}
export async function deleteUser(id: number) {
  const { data, error } = await supabase
    .from("app_user")
    .delete()
    .eq("id", id);

  return { data, error };
}

export async function createWorker(
  name: string,
  address: string,
  phone_no: string
) {
  console.log("CREATE HOUSE OWNER CALLED");
  const { data, error } = await supabase
    .from("app_user")
    .insert([
      {
        name,
        address,
        phone_no,
        role: "worker",
        age: 0,
        password: "123456"
      }
    ]);

  return { data, error };
}
export async function deleteWorker(id: number) {
  const { error } = await supabase
    .from("app_user")
    .delete()
    .eq("id", id);

  return { error };
}
export async function addCollection(
  house_id: number,
  worker_id: number,
  weight: number,
  amount: number
) {
  return await supabase
    .from("collections")
    .insert([
      {
        house_id,
        worker_id,
        weight,
        amount
      }
    ]);
}
export async function getCollections() {
  return await supabase
    .from("collections")
    .select("*")
    .order("created_at", { ascending: false });
}