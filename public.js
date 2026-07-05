// ==========================================
// FIREBASE CONFIGURATION (Must match admin.js)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyC1nTqnuoiYSmdvZjSLws9xjxWPEMEpyG8",
  authDomain: "mrpanvlogs.firebaseapp.com",
  projectId: "mrpanvlogs",
  storageBucket: "mrpanvlogs.firebasestorage.app",
  messagingSenderId: "672128070578",
  appId: "1:672128070578:web:ff1090da0c4e25f65caaab",
  measurementId: "G-K59MLVBYSM"
};

let db;
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

if (isFirebaseConfigured) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
}

// ==========================================
// MOCK DATABASE (Fallback)
// ==========================================
const defaultSiteConfig = {
  home: {
    heroTagline: "ভ্রমণ করি · গল্প বলি · ভিডিও বানাই",
    heroDesc: "পশ্চিমবঙ্গের সুন্দর জায়গাগুলো আবিষ্কার করি, ভারতের নানা প্রান্তে ঘুরে বেড়াই, অসাধারণ খাবার চেখে দেখি আর সেই অভিজ্ঞতা তোমাদের সাথে শেয়ার করি। বন্দেমাতরম! ভারত মাতা কি জয়! চলো একসাথে দুনিয়া ঘুরি! 🌍",
    subscribersCount: "50",
    videosCount: "120",
    floatCard1: "📍 দার্জিলিং",
    floatCard2: "🍜 Street Food",
    floatCard3: "🏔️ সিকিম",
    floatCard4: "🛕 পুজো Special"
  },
  about: {
    aboutDesc: "নমস্কার! আমি Mr Pan. আমার বাড়ি পশ্চিমবঙ্গের এক সুন্দর গ্রামে। ছোটবেলা থেকেই নতুন জায়গা দেখার আর নতুন মানুষের সাথে মেশার খুব শখ। সেই শখ থেকেই আমার এই ভ্লগিং এর যাত্রা শুরু।\n\nআমার উদ্দেশ্য হলো বাংলার সুন্দর জায়গাগুলো এবং আমাদের সংস্কৃতি সবার সামনে তুলে ধরা। আশা করি আপনারা সবাই আমার পাশে থাকবেন।",
    subscribersLabel: "50K+ YouTube Family",
    videosLabel: "120+ Travel & Food Vlogs",
    yearsLabel: "3+ Years of Journey"
  },
  contact: {
    email: "contact@mrpanvlogs.com",
    phone: "+91 98765 43210",
    location: "Kolkata, West Bengal, India"
  }
};

const mockDB = {
  videos: JSON.parse(localStorage.getItem('mock_videos')) || [],
  blogs: JSON.parse(localStorage.getItem('mock_blogs')) || [],
  siteConfig: JSON.parse(localStorage.getItem('mock_site_config')) || defaultSiteConfig
};

// ==========================================
// RENDER PUBLIC DATA
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  renderSiteConfig();

  const videosGrid = document.getElementById("dynamic-videos-grid");
  const blogsGrid = document.getElementById("dynamic-blogs-grid");

  if (videosGrid) {
    if (isFirebaseConfigured) {
      db.collection("videos").orderBy("timestamp", "desc").get().then(snapshot => {
        videosGrid.innerHTML = "";
        snapshot.forEach(doc => videosGrid.innerHTML += renderVideoCard(doc.data()));
      });
    } else {
      videosGrid.innerHTML = "";
      [...mockDB.videos].reverse().forEach(v => videosGrid.innerHTML += renderVideoCard(v));
    }
  }

  if (blogsGrid) {
    if (isFirebaseConfigured) {
      db.collection("blogs").orderBy("timestamp", "desc").get().then(snapshot => {
        blogsGrid.innerHTML = "";
        snapshot.forEach(doc => blogsGrid.innerHTML += renderBlogCard(doc.data()));
      });
    } else {
      blogsGrid.innerHTML = "";
      [...mockDB.blogs].reverse().forEach(b => blogsGrid.innerHTML += renderBlogCard(b));
    }
  }
});

function renderSiteConfig() {
  if (isFirebaseConfigured) {
    db.collection("config").doc("site").get().then(doc => {
      if (doc.exists) applySiteConfig(doc.data());
      else applySiteConfig(defaultSiteConfig);
    });
  } else {
    applySiteConfig(mockDB.siteConfig);
  }
}

function applySiteConfig(config) {
  // Home Page
  const hTagline = document.getElementById("dyn-home-tagline");
  const hDesc = document.getElementById("dyn-home-desc");
  const hSubCount = document.getElementById("dyn-home-subcount");
  const hVidCount = document.getElementById("dyn-home-vidcount");
  const hCard1 = document.getElementById("dyn-home-card1");
  const hCard2 = document.getElementById("dyn-home-card2");
  const hCard3 = document.getElementById("dyn-home-card3");
  const hCard4 = document.getElementById("dyn-home-card4");

  if (hTagline) hTagline.innerText = config.home.heroTagline;
  if (hDesc) hDesc.innerText = config.home.heroDesc;
  if (hSubCount) hSubCount.setAttribute("data-target", config.home.subscribersCount);
  if (hVidCount) hVidCount.setAttribute("data-target", config.home.videosCount);
  if (hSubCount) hSubCount.innerText = config.home.subscribersCount;
  if (hVidCount) hVidCount.innerText = config.home.videosCount;
  if (hCard1) hCard1.innerText = config.home.floatCard1;
  if (hCard2) hCard2.innerText = config.home.floatCard2;
  if (hCard3) hCard3.innerText = config.home.floatCard3;
  if (hCard4) hCard4.innerText = config.home.floatCard4;

  // About Page
  const aDesc = document.getElementById("dyn-about-desc");
  const aSubLabel = document.getElementById("dyn-about-sublabel");
  const aVidLabel = document.getElementById("dyn-about-vidlabel");
  const aYrLabel = document.getElementById("dyn-about-yrlabel");

  if (aDesc) aDesc.innerHTML = config.about.aboutDesc.replace(/\n/g, "<br/>");
  if (aSubLabel) aSubLabel.innerText = config.about.subscribersLabel;
  if (aVidLabel) aVidLabel.innerText = config.about.videosLabel;
  if (aYrLabel) aYrLabel.innerText = config.about.yearsLabel;

  // Contact Page
  const cEmail = document.getElementById("dyn-contact-email");

  if (cEmail) {
    cEmail.innerText = config.contact.email;
    cEmail.href = "mailto:" + config.contact.email;
  }
}

// ==========================================
// HANDLE CONTACT FORM SUBMISSION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const subject = document.getElementById("subject").value;
      const message = document.getElementById("message").value;
      
      const msgData = {
        name, email, subject, message,
        timestamp: Date.now(),
        date: new Date().toLocaleString()
      };

      const btn = document.getElementById("send-message-btn");
      const originalText = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      if (isFirebaseConfigured) {
        db.collection("messages").add(msgData).then(() => {
          showSuccess(btn, originalText);
        }).catch(err => {
          alert("Error sending message: " + err);
          resetBtn(btn, originalText);
        });
      } else {
        // Mock DB Save
        const msgs = JSON.parse(localStorage.getItem('mock_messages')) || [];
        msgData.id = "msg_" + Date.now();
        msgs.push(msgData);
        localStorage.setItem('mock_messages', JSON.stringify(msgs));
        
        setTimeout(() => showSuccess(btn, originalText), 800); // Simulate network delay
      }
    });
  }
});

function showSuccess(btn, originalText) {
  document.getElementById("formSuccess").style.display = "block";
  document.getElementById("contactForm").reset();
  resetBtn(btn, originalText);
  setTimeout(() => {
    document.getElementById("formSuccess").style.display = "none";
  }, 5000);
}

function resetBtn(btn, originalText) {
  btn.innerHTML = originalText;
  btn.disabled = false;
}

function renderVideoCard(data) {
  return `
    <div class="video-card">
      <div class="video-thumb">
        <div class="video-thumb-bg" style="background: ${data.bg};">
          <div class="thumb-icon">${data.icon}</div>
          <div class="thumb-title">Vlog</div>
        </div>
        <a href="https://www.youtube.com/watch?v=${data.ytId}" target="_blank" class="play-overlay">
          <div class="play-btn-circle"><i class="fas fa-play"></i></div>
        </a>
        <span class="video-duration">${data.duration}</span>
      </div>
      <div class="video-info">
        <h4 class="video-title">${data.title}</h4>
        <div class="video-meta">
          <span><i class="fas fa-eye"></i> ${data.views}</span>
        </div>
      </div>
    </div>
  `;
}

function renderBlogCard(data) {
  // Simple tag rendering
  const tagsHtml = data.tags.split(",").map(t => `<span class="blog-tag">${t.trim()}</span>`).join("");
  return `
    <div class="blog-card">
      <div class="blog-thumb">
        <div class="blog-thumb-inner">
          <span class="blog-emoji">${data.icon}</span>
        </div>
      </div>
      <div class="blog-content">
        <div class="blog-tags">${tagsHtml}</div>
        <h3 class="blog-title">${data.title}</h3>
        <p class="blog-excerpt">${data.excerpt}</p>
        <div class="blog-footer">
          <span class="blog-date"><i class="fas fa-calendar"></i> ${data.date}</span>
        </div>
      </div>
    </div>
  `;
}
