// ==========================================
// FIREBASE CONFIGURATION (REPLACE WITH YOURS)
// ==========================================
// To get these keys:
// 1. Go to console.firebase.google.com
// 2. Create a project
// 3. Add a Web App
// 4. Copy the config object below
const firebaseConfig = {
  apiKey: "AIzaSyC1nTqnuoiYSmdvZjSLws9xjxWPEMEpyG8",
  authDomain: "mrpanvlogs.firebaseapp.com",
  projectId: "mrpanvlogs",
  storageBucket: "mrpanvlogs.firebasestorage.app",
  messagingSenderId: "672128070578",
  appId: "1:672128070578:web:ff1090da0c4e25f65caaab",
  measurementId: "G-K59MLVBYSM"
};

// Initialize Firebase only if the user has replaced the config
let db, auth;
const isFirebaseConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

if (isFirebaseConfigured) {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  auth = firebase.auth();
} else {
  console.warn("Firebase is not configured! Admin panel will run in MOCK MODE using localStorage.");
}

// ==========================================
// MOCK DATABASE (For testing without Firebase)
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
  messages: JSON.parse(localStorage.getItem('mock_messages')) || [],
  siteConfig: JSON.parse(localStorage.getItem('mock_site_config')) || defaultSiteConfig,
  save: function() {
    localStorage.setItem('mock_videos', JSON.stringify(this.videos));
    localStorage.setItem('mock_blogs', JSON.stringify(this.blogs));
    localStorage.setItem('mock_messages', JSON.stringify(this.messages));
    localStorage.setItem('mock_site_config', JSON.stringify(this.siteConfig));
  }
};

// Seed mock data if empty
if (mockDB.videos.length === 0 && mockDB.blogs.length === 0) {
  mockDB.videos = [
    { id: "v1", title: "দার্জিলিংয়ের মেঘের দেশে | Darjeeling Hidden Gems", ytId: "dQw4w9WgXcQ", duration: "15:42", views: "45K views", bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", icon: "🏔️", timestamp: Date.now() }
  ];
  mockDB.blogs = [
    { id: "b1", title: "দার্জিলিং: মেঘের কোলে চা বাগানে একটি অবিস্মরণীয় সপ্তাহ", excerpt: "সূর্যোদয় থেকে সূর্যাস্ত — টাইগার হিলের চূড়া...", tags: "Travel, Hills", date: "June 15, 2025", icon: "🏔️", timestamp: Date.now() }
  ];
  mockDB.save();
}


// ==========================================
// ADMIN UI LOGIC
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
  const loginScreen = document.getElementById("login-screen");
  const dashboardScreen = document.getElementById("dashboard-screen");
  const loginBtn = document.getElementById("login-btn");
  const logoutBtn = document.getElementById("logout-btn-sidebar");
  const loginError = document.getElementById("login-error");
  const adminSidebar = document.getElementById("admin-sidebar");
  const hamburgerBtn = document.getElementById("admin-hamburger");

  // Toggle Sidebar
  hamburgerBtn.addEventListener("click", () => {
    adminSidebar.classList.toggle("open");
  });

  // Tab Switching via Sidebar
  const tabBtns = document.querySelectorAll(".sidebar-btn[data-tab]");
  const tabContents = document.querySelectorAll(".tab-content");
  
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
      
      // Auto-hide sidebar on mobile after clicking a tab
      if (window.innerWidth <= 768) {
        adminSidebar.classList.remove("open");
      }
    });
  });

  // Logo Click -> Navigate to Home Tab (No Reload)
  const adminLogo = document.getElementById("admin-logo-link");
  if (adminLogo) {
    adminLogo.addEventListener("click", (e) => {
      e.preventDefault(); // Prevent page reload
      const homeBtn = document.querySelector('.sidebar-btn[data-tab="home"]');
      if (homeBtn) homeBtn.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function showDashboard() {
    loginScreen.style.display = "none";
    dashboardScreen.style.display = "block";
    document.body.classList.add("dashboard-active");
    loadVideos();
    loadBlogs();
    loadSiteConfig();
    window.loadMessages(); // Call loadMessages
  }

  function hideDashboard() {
    loginScreen.style.display = "block";
    dashboardScreen.style.display = "none";
    document.body.classList.remove("dashboard-active");
    adminSidebar.classList.remove("open");
  }

  function loadSiteConfig() {
    if (isFirebaseConfigured) {
      db.collection("config").doc("site").get().then(doc => {
        if (doc.exists) populateSiteForms(doc.data());
        else populateSiteForms(defaultSiteConfig);
      });
    } else {
      populateSiteForms(mockDB.siteConfig);
    }
  }

  function populateSiteForms(config) {
    // Home
    document.getElementById("config-home-tagline").value = config.home.heroTagline;
    document.getElementById("config-home-desc").value = config.home.heroDesc;
    document.getElementById("config-home-subcount").value = config.home.subscribersCount;
    document.getElementById("config-home-vidcount").value = config.home.videosCount;
    document.getElementById("config-home-card1").value = config.home.floatCard1;
    document.getElementById("config-home-card2").value = config.home.floatCard2;
    document.getElementById("config-home-card3").value = config.home.floatCard3;
    document.getElementById("config-home-card4").value = config.home.floatCard4;
    
    // About
    document.getElementById("config-about-desc").value = config.about.aboutDesc;
    document.getElementById("config-about-sublabel").value = config.about.subscribersLabel;
    document.getElementById("config-about-vidlabel").value = config.about.videosLabel;
    document.getElementById("config-about-yrlabel").value = config.about.yearsLabel;
    
    // Contact
    document.getElementById("config-contact-email").value = config.contact.email;
  }

  // --- AUTHENTICATION ---
  if (isFirebaseConfigured) {
    auth.onAuthStateChanged((user) => {
      if (user) {
        showDashboard();
      } else {
        hideDashboard();
      }
    });

    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("admin-email").value;
      const pass = document.getElementById("admin-pass").value;
      auth.signInWithEmailAndPassword(email, pass).catch(err => {
        loginError.innerText = err.message;
        loginError.style.display = "block";
      });
    });

    logoutBtn.addEventListener("click", () => {
      auth.signOut();
    });
  } else {
    // MOCK MODE AUTH
    loginBtn.addEventListener("click", () => {
      const email = document.getElementById("admin-email").value;
      const pass = document.getElementById("admin-pass").value;
      if (email === "admin@mrpan.com" && pass === "123456") {
        showDashboard();
      } else {
        loginError.innerText = "Mock Mode: Use admin@mrpan.com / 123456";
        loginError.style.display = "block";
      }
    });
    logoutBtn.addEventListener("click", () => {
      hideDashboard();
    });
  }

  // --- CRUD OPERATIONS ---
  const videoForm = document.getElementById("video-form");
  const blogForm = document.getElementById("blog-form");

  // Add/Update Video
  videoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("video-id").value;
    const data = {
      title: document.getElementById("video-title").value,
      ytId: document.getElementById("video-yt-id").value,
      duration: document.getElementById("video-duration").value,
      views: document.getElementById("video-views").value,
      bg: document.getElementById("video-bg").value,
      icon: document.getElementById("video-icon").value,
      timestamp: Date.now()
    };

    if (isFirebaseConfigured) {
      if (id) {
        db.collection("videos").doc(id).update(data).then(() => { resetVideoForm(); loadVideos(); });
      } else {
        db.collection("videos").add(data).then(() => { resetVideoForm(); loadVideos(); });
      }
    } else {
      if (id) {
        const idx = mockDB.videos.findIndex(v => v.id === id);
        mockDB.videos[idx] = { ...data, id };
      } else {
        mockDB.videos.push({ ...data, id: "v" + Date.now() });
      }
      mockDB.save();
      resetVideoForm(); loadVideos();
    }
  });

  // Add/Update Blog
  blogForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = document.getElementById("blog-id").value;
    const data = {
      title: document.getElementById("blog-title").value,
      date: document.getElementById("blog-date").value,
      tags: document.getElementById("blog-tags").value,
      icon: document.getElementById("blog-icon").value,
      excerpt: document.getElementById("blog-excerpt").value,
      timestamp: Date.now()
    };

    if (isFirebaseConfigured) {
      if (id) {
        db.collection("blogs").doc(id).update(data).then(() => { resetBlogForm(); loadBlogs(); });
      } else {
        db.collection("blogs").add(data).then(() => { resetBlogForm(); loadBlogs(); });
      }
    } else {
      if (id) {
        const idx = mockDB.blogs.findIndex(b => b.id === id);
        mockDB.blogs[idx] = { ...data, id };
      } else {
        mockDB.blogs.push({ ...data, id: "b" + Date.now() });
      }
      mockDB.save();
      resetBlogForm(); loadBlogs();
    }
  });

  // --- HELPERS ---
  window.deleteVideo = (id) => {
    if(!confirm("Delete this video?")) return;
    if(isFirebaseConfigured) {
      db.collection("videos").doc(id).delete().then(loadVideos);
    } else {
      mockDB.videos = mockDB.videos.filter(v => v.id !== id);
      mockDB.save(); loadVideos();
    }
  };

  window.deleteBlog = (id) => {
    if(!confirm("Delete this blog?")) return;
    if(isFirebaseConfigured) {
      db.collection("blogs").doc(id).delete().then(loadBlogs);
    } else {
      mockDB.blogs = mockDB.blogs.filter(b => b.id !== id);
      mockDB.save(); loadBlogs();
    }
  };

  window.editVideo = (id) => {
    let data;
    if(isFirebaseConfigured) {
      // Need async fetch here, but for simplicity we can pass data in DOM or fetch
      // For this demo, let's just use a simple fetch
      db.collection("videos").doc(id).get().then(doc => {
        fillVideoForm(doc.id, doc.data());
      });
    } else {
      data = mockDB.videos.find(v => v.id === id);
      fillVideoForm(id, data);
    }
  };

  window.editBlog = (id) => {
    let data;
    if(isFirebaseConfigured) {
      db.collection("blogs").doc(id).get().then(doc => {
        fillBlogForm(doc.id, doc.data());
      });
    } else {
      data = mockDB.blogs.find(b => b.id === id);
      fillBlogForm(id, data);
    }
  };

  function fillVideoForm(id, data) {
    document.getElementById("video-id").value = id;
    document.getElementById("video-title").value = data.title;
    document.getElementById("video-yt-id").value = data.ytId;
    document.getElementById("video-duration").value = data.duration;
    document.getElementById("video-views").value = data.views;
    document.getElementById("video-bg").value = data.bg;
    document.getElementById("video-icon").value = data.icon;
    document.getElementById("video-form-title").innerText = "Edit Video";
    document.getElementById("video-submit-btn").innerText = "Update Video";
    document.getElementById("video-cancel-btn").style.display = "inline-block";
    document.getElementById("video-form-card").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function fillBlogForm(id, data) {
    document.getElementById("blog-id").value = id;
    document.getElementById("blog-title").value = data.title;
    document.getElementById("blog-date").value = data.date;
    document.getElementById("blog-tags").value = data.tags;
    document.getElementById("blog-icon").value = data.icon;
    document.getElementById("blog-excerpt").value = data.excerpt;
    document.getElementById("blog-form-title").innerText = "Edit Blog";
    document.getElementById("blog-submit-btn").innerText = "Update Blog";
    document.getElementById("blog-cancel-btn").style.display = "inline-block";
    document.getElementById("blog-form-card").style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetVideoForm() {
    videoForm.reset();
    document.getElementById("video-id").value = "";
    document.getElementById("video-form-title").innerText = "Add New Video";
    document.getElementById("video-submit-btn").innerText = "Save Video";
    document.getElementById("video-cancel-btn").style.display = "none";
    document.getElementById("video-form-card").style.display = "none";
  }

  function resetBlogForm() {
    blogForm.reset();
    document.getElementById("blog-id").value = "";
    document.getElementById("blog-form-title").innerText = "Add New Blog";
    document.getElementById("blog-submit-btn").innerText = "Save Blog";
    document.getElementById("blog-cancel-btn").style.display = "none";
    document.getElementById("blog-form-card").style.display = "none";
  }

  document.getElementById("video-cancel-btn").addEventListener("click", resetVideoForm);
  document.getElementById("blog-cancel-btn").addEventListener("click", resetBlogForm);

  // Load Data
  function loadVideos() {
    const list = document.getElementById("videos-list");
    list.innerHTML = "Loading...";
    if (isFirebaseConfigured) {
      db.collection("videos").orderBy("timestamp", "desc").get().then(snapshot => {
        list.innerHTML = "";
        snapshot.forEach(doc => list.appendChild(createDataElement(doc.id, doc.data(), "Video")));
      });
    } else {
      list.innerHTML = "";
      [...mockDB.videos].reverse().forEach(v => list.appendChild(createDataElement(v.id, v, "Video")));
    }
  }

  function loadBlogs() {
    const list = document.getElementById("blogs-list");
    list.innerHTML = "Loading...";
    if (isFirebaseConfigured) {
      db.collection("blogs").orderBy("timestamp", "desc").get().then(snapshot => {
        list.innerHTML = "";
        snapshot.forEach(doc => list.appendChild(createDataElement(doc.id, doc.data(), "Blog")));
      });
    } else {
      list.innerHTML = "";
      [...mockDB.blogs].reverse().forEach(b => list.appendChild(createDataElement(b.id, b, "Blog")));
    }
  }

  // --- MAIL (MESSAGES) LOGIC ---
  window.loadMessages = () => {
    const list = document.getElementById("messages-list");
    list.innerHTML = "Loading...";
    if (isFirebaseConfigured) {
      db.collection("messages").orderBy("timestamp", "desc").get().then(snapshot => {
        list.innerHTML = "";
        if (snapshot.empty) { list.innerHTML = "<p>No messages yet.</p>"; return; }
        snapshot.forEach(doc => list.appendChild(createMessageElement(doc.id, doc.data())));
      }).catch(err => {
        list.innerHTML = "<p>Error loading messages.</p>";
      });
    } else {
      list.innerHTML = "";
      if (mockDB.messages.length === 0) { list.innerHTML = "<p>No messages yet.</p>"; return; }
      [...mockDB.messages].reverse().forEach(m => list.appendChild(createMessageElement(m.id, m)));
    }
  };

  window.deleteMessage = (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    if (isFirebaseConfigured) {
      db.collection("messages").doc(id).delete().then(() => window.loadMessages());
    } else {
      mockDB.messages = mockDB.messages.filter(m => m.id !== id);
      mockDB.save();
      window.loadMessages();
    }
  };

  function createMessageElement(id, data) {
    const div = document.createElement("div");
    div.className = "admin-card";
    div.innerHTML = `
      <div class="admin-card-content">
        <div style="font-size: 1.5rem; margin-bottom: 8px; color: var(--accent);"><i class="fas fa-envelope"></i></div>
        <h4 class="admin-card-title">${data.subject}</h4>
        <div class="admin-card-meta"><i class="fas fa-user"></i> ${data.name} &bull; <i class="fas fa-at"></i> ${data.email} &bull; <i class="fas fa-calendar"></i> ${data.date}</div>
        <p style="font-size: 0.95rem; color: var(--text-light); margin-top: 8px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px;">${data.message}</p>
      </div>
      <div class="admin-card-actions">
        <button class="btn-delete" onclick="deleteMessage('${id}')"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;
    return div;
  }

  window.toggleVideoForm = () => {
    const card = document.getElementById("video-form-card");
    card.style.display = card.style.display === "block" ? "none" : "block";
  };
  
  window.toggleBlogForm = () => {
    const card = document.getElementById("blog-form-card");
    card.style.display = card.style.display === "block" ? "none" : "block";
  };

  function createDataElement(id, data, type) {
    const div = document.createElement("div");
    div.className = "admin-card";
    
    if (type === "Video") {
      div.innerHTML = `
        <div class="admin-card-content">
          <div style="font-size: 2rem; margin-bottom: 12px;">${data.icon}</div>
          <h4 class="admin-card-title">${data.title}</h4>
          <div class="admin-card-meta"><i class="fas fa-eye"></i> ${data.views} &bull; <i class="fas fa-clock"></i> ${data.duration}</div>
        </div>
        <div class="admin-card-actions">
          <button class="btn-edit" onclick="editVideo('${id}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn-delete" onclick="deleteVideo('${id}')"><i class="fas fa-trash"></i> Delete</button>
        </div>
      `;
    } else {
      div.innerHTML = `
        <div class="admin-card-content">
          <div style="font-size: 2rem; margin-bottom: 12px;">${data.icon}</div>
          <h4 class="admin-card-title">${data.title}</h4>
          <div class="admin-card-meta"><i class="fas fa-calendar"></i> ${data.date}</div>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${data.excerpt}</p>
        </div>
        <div class="admin-card-actions">
          <button class="btn-edit" onclick="editBlog('${id}')"><i class="fas fa-edit"></i> Edit</button>
          <button class="btn-delete" onclick="deleteBlog('${id}')"><i class="fas fa-trash"></i> Delete</button>
        </div>
      `;
    }
    return div;
  }

  // --- SAVE SITE CONFIG SETTINGS ---
  window.saveHomeSettings = () => {
    const homeConfig = {
      heroTagline: document.getElementById("config-home-tagline").value,
      heroDesc: document.getElementById("config-home-desc").value,
      subscribersCount: document.getElementById("config-home-subcount").value,
      videosCount: document.getElementById("config-home-vidcount").value,
      floatCard1: document.getElementById("config-home-card1").value,
      floatCard2: document.getElementById("config-home-card2").value,
      floatCard3: document.getElementById("config-home-card3").value,
      floatCard4: document.getElementById("config-home-card4").value
    };
    saveConfigSection("home", homeConfig);
  };

  window.saveAboutSettings = () => {
    const aboutConfig = {
      aboutDesc: document.getElementById("config-about-desc").value,
      subscribersLabel: document.getElementById("config-about-sublabel").value,
      videosLabel: document.getElementById("config-about-vidlabel").value,
      yearsLabel: document.getElementById("config-about-yrlabel").value
    };
    saveConfigSection("about", aboutConfig);
  };

  window.saveContactSettings = () => {
    const contactConfig = {
      email: document.getElementById("config-contact-email").value,
      phone: mockDB.siteConfig.contact.phone,
      location: mockDB.siteConfig.contact.location
    };
    saveConfigSection("contact", contactConfig);
  };

  function saveConfigSection(section, data) {
    if (isFirebaseConfigured) {
      db.collection("config").doc("site").set({
        [section]: data
      }, { merge: true }).then(() => {
        alert(section.toUpperCase() + " settings saved to Firebase!");
      }).catch(err => alert("Error saving: " + err));
    } else {
      mockDB.siteConfig[section] = data;
      mockDB.save();
      alert(section.toUpperCase() + " settings saved in Mock Mode!");
    }
  }
});
