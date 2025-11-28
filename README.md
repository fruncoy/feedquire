<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedquire - Test AI. Give Feedback. Earn Up to $14 a Task</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap');

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            overflow-x: hidden;
            background: #ffffff;
        }

        .header {
            position: fixed;
            top: 2rem;
            left: 5%;
            right: 5%;
            z-index: 1000;
            padding: 1.5rem 2.5rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #ffffff;
            border: 1px solid rgba(0, 1, 80, 0.08);
            border-radius: 50px;
            box-shadow: 0 4px 20px rgba(0, 1, 80, 0.05);
        }

        .logo {
            font-size: 1.8rem;
            font-weight: 700;
            color: #000150;
            letter-spacing: -0.5px;
        }

        .nav-container {
            display: flex;
            align-items: center;
            gap: 2.5rem;
        }

        .nav-link {
            background: transparent;
            color: #000150;
            border: none;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1rem;
            text-decoration: none;
        }

        .nav-link:hover {
            color: #6366f1;
        }

        .mobile-menu-btn {
            display: none;
            background: transparent;
            border: none;
            cursor: pointer;
            padding: 0.5rem;
            color: #000150;
            transition: all 0.3s ease;
        }

        .mobile-menu-btn:hover {
            opacity: 0.7;
        }

        .mobile-menu-btn svg {
            width: 24px;
            height: 24px;
            transition: transform 0.3s ease;
        }

        .mobile-menu-btn.active svg {
            transform: rotate(90deg);
        }

        .mobile-menu {
            display: none;
            position: fixed;
            top: 5rem;
            right: 5%;
            background: #ffffff;
            border: 1px solid rgba(0, 1, 80, 0.08);
            border-radius: 16px;
            padding: 1rem;
            box-shadow: 0 10px 40px rgba(0, 1, 80, 0.15);
            min-width: 200px;
            opacity: 0;
            transform: translateY(-10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .mobile-menu.active {
            display: block;
            animation: slideDown 0.3s ease forwards;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .mobile-menu a {
            display: block;
            padding: 0.75rem 1rem;
            color: #000150;
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s ease;
            border-radius: 8px;
        }

        .mobile-menu a:hover {
            background: rgba(0, 1, 80, 0.05);
            color: #6366f1;
        }

        .btn-header {
            display: none;
        }

        .hero {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10rem 5% 4rem;
            background: #ffffff;
            overflow: hidden;
        }

        .hero-content {
            position: relative;
            z-index: 1;
            max-width: 1200px;
            text-align: center;
        }

        h1 {
            font-size: 4.5rem;
            font-weight: 800;
            line-height: 1.1;
            color: #000150;
            margin-bottom: 1.5rem;
            letter-spacing: -2px;
            animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        h1 .regular-text {
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            color: #000150;
        }

        h1 .italic-text {
            font-family: 'Times New Roman', serif;
            font-style: italic;
            font-weight: 700;
            color: #000150;
        }

        .gradient-text {
            color: #000150;
        }

        .subtitle {
            font-size: 1.35rem;
            line-height: 1.7;
            color: #475569;
            max-width: 800px;
            margin: 0 auto 3rem;
            font-weight: 400;
            animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .cta-container {
            display: flex;
            gap: 1.2rem;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            animation: fadeInUp 0.8s ease-out 0.6s both;
        }

        .btn-cta {
            padding: 1.1rem 2.5rem;
            background: #000150;
            color: white;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1.05rem;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 10px 40px rgba(0, 1, 80, 0.2);
            white-space: nowrap;
        }

        .btn-cta:hover {
            background: #000180;
            transform: translateY(-2px);
            box-shadow: 0 15px 50px rgba(0, 1, 80, 0.35);
        }

        .btn-secondary {
            padding: 0;
            background: transparent;
            color: #000150;
            border: none;
            font-weight: 600;
            font-size: 1.05rem;
            cursor: pointer;
            transition: all 0.3s ease;
            white-space: nowrap;
        }

        .btn-secondary:hover {
            color: #6366f1;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 968px) {
            .nav-container {
                display: none;
            }

            .mobile-menu-btn {
                display: block;
            }

            .header {
                left: 3%;
                right: 3%;
                padding: 1rem 1.5rem;
            }
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 2.8rem;
            }

            .subtitle {
                font-size: 1.1rem;
            }

            .cta-container {
                gap: 1rem;
            }

            .btn-cta {
                padding: 0.9rem 1.8rem;
                font-size: 0.95rem;
            }

            .btn-secondary {
                font-size: 0.95rem;
            }
        }
    </style>
</head>
<body>
    <header class="header">
        <div class="logo">feedquire</div>
        <div class="nav-container">
            <a href="#" class="nav-link">How It Works</a>
            <a href="#" class="nav-link">Why Us</a>
            <a href="#" class="nav-link">Pricing</a>
            <a href="#" class="nav-link">FAQs</a>
        </div>
        <button class="mobile-menu-btn" onclick="toggleMobileMenu()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                <rect x="3" y="14" width="7" height="7" rx="1"></rect>
            </svg>
        </button>
    </header>

    <div class="mobile-menu" id="mobileMenu">
        <a href="#">How It Works</a>
        <a href="#">Why Us</a>
        <a href="#">Pricing</a>
        <a href="#">FAQs</a>
    </div>

    <section class="hero">
        <div class="hero-content">
            <h1>
                <span class="regular-text">Test AI.</span> <span class="italic-text">Give Feedback.</span> <span class="gradient-text regular-text">Earn Up to $14 Per Task.</span>
            </h1>
            
            <p class="subtitle">
                Power smarter decisions. Tell users if the platform is reliable, show investors if the product is worth backing, and give developers a clear roadmap for improvements.
            </p>

            <div class="cta-container">
                <button class="btn-cta">Start Earning</button>
                <button class="btn-secondary">How It Works</button>
            </div>
        </div>
    </section>

    <script>
        function toggleMobileMenu() {
            const menu = document.getElementById('mobileMenu');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            menu.classList.toggle('active');
            menuBtn.classList.toggle('active');
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const menu = document.getElementById('mobileMenu');
            const menuBtn = document.querySelector('.mobile-menu-btn');
            
            if (!menu.contains(event.target) && !menuBtn.contains(event.target)) {
                menu.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    </script>
</body>
</html>