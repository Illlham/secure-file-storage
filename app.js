const SUPABASE_URL = "https://iapxuilqldykkbwyjeop.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhcHh1aWxxbGR5a2tid3lqZW9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTgxOTQsImV4cCI6MjA3NzY3NDE5NH0.FHGhqpcVhafSoAlS3fKv4opbPSTZzH2Td6sPzco45z0";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// DOM elements
const email = document.getElementById('email');
const password = document.getElementById('password');
const signupBtn = document.getElementById('signup');
const loginBtn = document.getElementById('login');
const uploadSection = document.getElementById('upload-section');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const status = document.getElementById('status');

// Sign up
signupBtn.onclick = async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (error) alert(error.message);
  else alert("Registrasi berhasil! Silakan login.");
};

// Login
loginBtn.onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (error) alert(error.message);
  else {
    uploadSection.style.display = "block";
    document.getElementById('auth-section').style.display = "none";
  }
};

// Upload terenkripsi
uploadBtn.onclick = async () => {
  const file = fileInput.files[0];
  if (!file) return alert("Pilih file dulu!");

  const reader = new FileReader();
  reader.onload = async function (e) {
    const wordArray = CryptoJS.lib.WordArray.create(e.target.result);
    const encrypted = CryptoJS.AES.encrypt(wordArray, "kunci-rahasia").toString();
    const blob = new Blob([encrypted], { type: "text/plain" });

    const fileName = `${Date.now()}_${file.name}.enc`;
    const { data, error } = await supabase.storage.from('secure-files').upload(fileName, blob);
    if (error) status.innerText = "❌ Upload gagal: " + error.message;
    else status.innerText = "✅ File terenkripsi dan diupload aman!";
  };
  reader.readAsArrayBuffer(file);
};
