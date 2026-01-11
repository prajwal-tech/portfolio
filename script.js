    // ============================================================================
    // LOADING SCREEN
    // ============================================================================
    window.addEventListener('load', () => {
      setTimeout(() => {
        const loadingOverlay = document.getElementById('loading-overlay');
        loadingOverlay.classList.add('hidden');
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
        }, 500);
      }, 1000);
    });

    // ============================================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ============================================================================
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.timeline-item, .project-card').forEach(el => {
      observer.observe(el);
    });

    // ============================================================================
    // ANIMATED COUNTERS
    // ============================================================================
    const animateCounter = (element, target) => {
      const start = parseInt(element.textContent);
      const duration = 2000;
      const step = (target - start) / (duration / 16);
      let current = start;

      const timer = setInterval(() => {
        current += step;
        if ((step > 0 && current >= target) || (step < 0 && current <= target)) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 16);
    };

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.stat-number');
          counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, target);
          });
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-container').forEach(container => {
      counterObserver.observe(container);
    });

    // ============================================================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ============================================================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          const navHeight = document.querySelector('.nav').offsetHeight;
          const targetPosition = target.offsetTop - navHeight - 20;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      });
    });

    // ============================================================================
    // SCROLL EVENT HANDLER
    // ============================================================================
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const nav = document.querySelector('.nav');
          const scrollTop = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const scrollPercent = (scrollTop / docHeight) * 100;

          // Update scroll progress
          document.querySelector('.scroll-progress').style.width = scrollPercent + '%';

          // Update nav background
          if (scrollTop > 100) {
            nav.classList.add('scrolled');
          } else {
            nav.classList.remove('scrolled');
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ============================================================================
    // THEME TOGGLE
    // ============================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');

    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      themeIcon.textContent = newTheme === 'light' ? '☀️' : '🌙';
      localStorage.setItem('theme', newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeIcon.textContent = savedTheme === 'light' ? '☀️' : '🌙';

    // ============================================================================
    // TYPING ANIMATION
    // ============================================================================
    const roles = ['AI/ML Engineer', 'Software Developer', 'Tech Innovator'];
    let roleIndex = 0;
    let charIndex = 0;
    let isTyping = false;
    const roleText = document.getElementById('role-text');

    // Ensure element starts empty
    roleText.textContent = '';

    function typeWriter() {
      if (isTyping) return;
      isTyping = true;

      if (charIndex < roles[roleIndex].length) {
        roleText.textContent = roles[roleIndex].substring(0, charIndex + 1);
        charIndex++;
        setTimeout(() => {
          isTyping = false;
          typeWriter();
        }, 100);
      } else {
        setTimeout(() => {
          isTyping = false;
          eraseText();
        }, 2000);
      }
    }

    function eraseText() {
      if (isTyping) return;
      isTyping = true;

      if (charIndex > 0) {
        roleText.textContent = roles[roleIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(() => {
          isTyping = false;
          eraseText();
        }, 50);
      } else {
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(() => {
          isTyping = false;
          typeWriter();
        }, 500);
      }
    }

    // Start typing animation after page loads
    window.addEventListener('load', () => {
      setTimeout(typeWriter, 1000);
    });

    // ============================================================================
    // SCROLL TO TOP FUNCTION
    // ============================================================================
    function scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // ============================================================================
    // ENHANCED THREE.JS 3D ANIMATION
    // ============================================================================
    let scene, camera, renderer, particles, geometry, material, mesh;
    let mouse = { x: 0, y: 0 };
    let targetMouse = { x: 0, y: 0 };
    let animationId;

    function initThreeJS() {
      const canvas = document.getElementById('hero-canvas');
      if (!canvas) {
        console.warn('Hero canvas not found');
        return;
      }

      try {
        // Scene setup
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

        // Create floating particles with optimized count
        const particleCount = window.innerWidth < 768 ? 100 : 200; // Reduce particles on mobile
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] = (Math.random() - 0.5) * 20;
          positions[i + 1] = (Math.random() - 0.5) * 20;
          positions[i + 2] = (Math.random() - 0.5) * 20;

          colors[i] = Math.random() * 0.5 + 0.5;     // R
          colors[i + 1] = Math.random() * 0.5 + 0.5; // G
          colors[i + 2] = Math.random() * 0.5 + 0.5; // B
        }

        geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        material = new THREE.PointsMaterial({
          size: 0.05,
          vertexColors: true,
          transparent: true,
          opacity: 0.8,
          blending: THREE.AdditiveBlending
        });

        particles = new THREE.Points(geometry, material);
        scene.add(particles);

        // Create geometric shapes with instancing for better performance
        const geometries = [
          new THREE.IcosahedronGeometry(0.5, 0),
          new THREE.OctahedronGeometry(0.4, 0),
          new THREE.TetrahedronGeometry(0.3, 0)
        ];

        const shapeMaterial = new THREE.MeshPhongMaterial({
          color: 0x00d4ff,
          transparent: true,
          opacity: 0.3,
          wireframe: true
        });

        const shapeCount = window.innerWidth < 768 ? 4 : 8; // Reduce shapes on mobile
        for (let i = 0; i < shapeCount; i++) {
          const geometry = geometries[Math.floor(Math.random() * geometries.length)].clone();
          const mesh = new THREE.Mesh(geometry, shapeMaterial.clone());
          mesh.position.set(
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15,
            (Math.random() - 0.5) * 15
          );
          mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
          scene.add(mesh);
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00d4ff, 1, 100);
        pointLight.position.set(10, 10, 10);
        scene.add(pointLight);

        camera.position.z = 5;

        // Mouse interaction
        document.addEventListener('mousemove', (event) => {
          targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        animate();
      } catch (error) {
        console.warn('Three.js initialization failed:', error);
      }
    }

    function animate() {
      animationId = requestAnimationFrame(animate);

      if (!scene || !camera || !renderer) return;

      // Smooth mouse follow
      mouse.x += (targetMouse.x - mouse.x) * 0.02;
      mouse.y += (targetMouse.y - mouse.y) * 0.02;

      // Rotate particles
      if (particles) {
        particles.rotation.x += 0.0003;
        particles.rotation.y += 0.0005;
        particles.rotation.z += 0.0001;

        // Mouse interaction with particles
        particles.rotation.x += mouse.y * 0.02;
        particles.rotation.y += mouse.x * 0.02;
      }

      // Rotate geometric shapes
      scene.children.forEach((child, index) => {
        if (child.type === 'Mesh' && child.geometry.type !== 'BufferGeometry') {
          child.rotation.x += 0.002 + index * 0.0002;
          child.rotation.y += 0.003 + index * 0.0003;
          child.rotation.z += 0.001 + index * 0.0001;
        }
      });

      // Camera subtle movement
      camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 2 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    }

    function onWindowResize() {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener('resize', onWindowResize);

    // Initialize Three.js after page load with delay
    window.addEventListener('load', () => {
      setTimeout(() => {
        initThreeJS();
      }, 500);
    });

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      if (renderer) {
        renderer.dispose();
      }
    });

    // ============================================================================
    // PERFORMANCE OPTIMIZATIONS
    // ============================================================================
    // Use passive listeners where possible
    // Debounce scroll events
    // Limit animation frame rate on low-end devices
    if ('performance' in window && 'memory' in window.performance) {
      // Monitor memory usage
      setInterval(() => {
        const memInfo = window.performance.memory;
        if (memInfo.usedJSHeapSize > memInfo.totalJSHeapSize * 0.8) {
          console.warn('High memory usage detected');
        }
      }, 10000);
    }

    // ============================================================================
    // AI CHAT WIDGET FUNCTIONALITY
    // ============================================================================
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const chatClose = document.getElementById('chat-close');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle chat window
    chatToggle.addEventListener('click', () => {
      const isOpening = !chatWindow.classList.contains('open');
      chatWindow.classList.toggle('open');
      if (isOpening) {
        typeMessage("Welcome to the world of Prajwal!", document.getElementById('initial-message'), () => {
          speechSynthesis.speak(new SpeechSynthesisUtterance("Welcome to the world of Prajwal"));
        });
      }
    });

    chatClose.addEventListener('click', () => {
      chatWindow.classList.remove('open');
    });

    // Send message function
    function sendMessage() {
      const message = chatInput.value.trim();
      if (!message) return;

      // Add user message
      addMessage(message, 'user');
      chatInput.value = '';

      // Generate bot response
      setTimeout(() => {
        const response = generateResponse(message);
        addMessage(response, 'bot');
      }, 500);
    }

    // Typing effect function
    function typeMessage(text, element, callback) {
      let index = 0;
      element.textContent = '';
      const interval = setInterval(() => {
        element.textContent += text[index];
        index++;
        if (index >= text.length) {
          clearInterval(interval);
          if (callback) callback();
        }
      }, 50); // Adjust speed here
    }

    // Add message to chat
    function addMessage(text, type) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `message ${type}`;
      messageDiv.textContent = text;
      chatMessages.appendChild(messageDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Simple AI response generator
    function generateResponse(message) {
      const lowerMessage = message.toLowerCase();

      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! I'm Prajwal's AI assistant my name is NEXA. How can I help you today?";
      } else if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
        return "I am NEXA Prajwal's AI assistant, connecting him to the world through intelligent conversations. I'm here to help you learn about his portfolio, experience, and projects!";
      } else if (lowerMessage.includes('prajwal') || lowerMessage.includes('about you') || lowerMessage.includes('tell me about')) {
        return "Prajwal N.A is an AI/ML Engineer & Software Developer with a B.Tech in Electronics & Communication Engineering and a minor in Computer Science. He specializes in building scalable, data-driven systems using Python, with expertise in Machine Learning, AI, TensorFlow, PyTorch, NLP, and more. He has completed 6 internships and 15 projects, focusing on AI solutions across various industries.";
      } else if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
        return "Prajwal has experience as a Data Integration Engineer Intern at ClearTax and Software Developer Engineer Intern at EQUILIBRATE Pvt. Ltd, where he built AI chatbots and data pipelines.";
      } else if (lowerMessage.includes('project') || lowerMessage.includes('projects')) {
        return "Prajwal has completed 15 projects, including AI chatbots using LangChain and LLaMA, data integration pipelines, and various ML applications.";
      } else if (lowerMessage.includes('skill') || lowerMessage.includes('skills')) {
        return "Prajwal specializes in Python, Machine Learning, AI, TensorFlow, PyTorch, NLP, LangChain, MongoDB, FastAPI, Django, and Docker.";
      } else if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
        return "You can contact Prajwal at prajwalnagesh73@gmail.com or call +91 819 718 0393.";
      } else if (lowerMessage.includes('resume')) {
        return "You can download Prajwal's resume from the portfolio website.";
      } else if (lowerMessage.includes('github') || lowerMessage.includes('linkedin')) {
        return "Check out Prajwal's GitHub at github.com/prajwal-tech and LinkedIn at linkedin.com/in/prajwal-nagesh-512028217.";
      } else {
        return "I'm here to help with information about Prajwal's portfolio. Feel free to ask about his experience, projects, skills, or how to contact him!";
      }
    }

    // Event listeners
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });