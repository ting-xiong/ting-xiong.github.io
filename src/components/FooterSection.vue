<template>
  <section id="about" class="about-section">
    <div class="about-inner">
      <h2 class="about-title">About Me</h2>
      <div class="about-divider"></div>
      <div class="about-content">
        <h3 class="about-name">Ting Xiong</h3>
        <div class="about-credentials">
          <p class="credential">
            <span class="credential-label">Bachelor of Fine Art</span>
            <span class="credential-at">at</span>
            <span class="credential-school">Academy of Art University</span>,
            San Francisco, CA
          </p>
          <p class="credential">
            <span class="credential-label">Master of Fine Art Candidate</span>
            <span class="credential-at">at</span>
            <span class="credential-school"
              >University of California, San Diego</span
            >, La Jolla, CA
          </p>
          <p class="credential-discipline">Costume Design</p>
        </div>
        <div class="about-links">
          <a href="mailto:tixiong@ucsd.edu" class="about-link">
            <span class="link-icon">&#9993;</span> tixiong@ucsd.edu
          </a>
          <a href="/assets/ting-xiong-cv.pdf" target="_blank" class="about-link">
            Resume / CV
          </a>
        </div>
      </div>
    </div>
  </section>
  <footer class="site-footer">
    <p>&copy; Ting Xiong. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.about-section {
  padding: 6rem 2rem;
  background: #1a1a1a;
  color: #fff;
}

.about-inner {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
}

.about-title {
  font-family: 'Cinzel', serif;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 400;
  letter-spacing: 0.15em;
  margin: 0 0 1rem;
}

.about-divider {
  width: 60px;
  height: 2px;
  background: #c9a96e;
  margin: 0 auto 3rem;
}

.about-name {
  font-family: 'Cinzel', serif;
  font-size: 1.8rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  margin: 0 0 2rem;
}

.about-credentials {
  margin-bottom: 2.5rem;
}

.credential {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.9rem;
  line-height: 1.8;
  margin: 0.5rem 0;
  color: rgba(255, 255, 255, 0.85);
}

.credential-label {
  font-weight: 500;
}

.credential-at {
  font-style: italic;
  margin: 0 0.3rem;
  color: rgba(255, 255, 255, 0.5);
}

.credential-school {
  color: #c9a96e;
}

.credential-discipline {
  font-family: 'Cinzel', serif;
  font-size: 1.3rem;
  margin: 1.5rem 0 0;
  letter-spacing: 0.1em;
  color: #c9a96e;
}

.about-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
}

.about-link {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  letter-spacing: 0.05em;
  transition: color 0.3s;
}

.about-link:hover {
  color: #c9a96e;
}

.link-icon {
  margin-right: 0.3rem;
}

.site-footer {
  background: #111;
  padding: 1.5rem 2rem;
  text-align: center;
}

.site-footer p {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  letter-spacing: 0.05em;
}
</style>
