import { supabase } from './lib/supabase'

async function testInsert() {

  const { data, error } = await supabase
    .from('app_user')
    .insert([
      {
        name: 'Ahamed',
        age: 20,
        address: 'Chennai',
        phone_no: '9876543210',
        role: 'Citizen',
        password: '123456'
      }
    ])

  console.log(data)
  console.log(error)
}

testInsert()