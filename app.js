document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Mobile Drawer Toggle ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');

  // Create overlay element dynamically
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  document.querySelector('.app-container').appendChild(overlay);

  const toggleMobileMenu = () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');

    // Lock/unlock body scrolling on mobile view
    if (sidebar.classList.contains('open')) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Change menu icon state
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) {
      if (sidebar.classList.contains('open')) {
        icon.setAttribute('data-lucide', 'x');
      } else {
        icon.setAttribute('data-lucide', 'menu');
      }
      lucide.createIcons();
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }

  overlay.addEventListener('click', toggleMobileMenu);

  // --- Sidebar Navigation & Smooth Scroll ---
  const navLinks = document.querySelectorAll('.nav-item');
  const sections = Array.from(navLinks)
    .filter(link => !link.classList.contains('no-scrollspy'))
    .map(link => {
      const hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        return document.querySelector(hash);
      }
      return null;
    })
    .filter(Boolean);

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // If it's an anchor link
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(href);
        if (targetSection) {
          // Close mobile menu if open
          if (sidebar.classList.contains('open')) {
            toggleMobileMenu();
          }

          // Smooth scroll to target
          const offsetTop = targetSection.offsetTop - (window.innerWidth <= 768 ? 80 : 20);
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });

          // Set active states immediately
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      }
    });
  });

  // --- Scroll Spy ---
  const scrollSpy = () => {
    const scrollPos = window.scrollY || document.documentElement.scrollTop;

    // Determine current active section
    let currentActive = sections[0];
    const threshold = window.innerWidth <= 768 ? 90 : 150;

    sections.forEach(section => {
      if (scrollPos >= section.offsetTop - threshold) {
        currentActive = section;
      }
    });

    if (currentActive) {
      const activeId = currentActive.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (!link.classList.contains('no-scrollspy') && link.getAttribute('href') === `#${activeId}`) {
          link.classList.add('active');
        }
      });
    }
  };

  window.addEventListener('scroll', scrollSpy);
  // Run once on load to set initial state
  setTimeout(scrollSpy, 100);

  // --- Animate Progress Bar on Scroll ---
  const progressFill = document.querySelector('.progress-fill');
  const currentlyBuildingCard = document.querySelector('.currently-building-card');

  if (progressFill && currentlyBuildingCard) {
    const targetProgress = 45; // Matches new target progress (45%)
    let animated = false;

    const animateProgress = () => {
      const rect = currentlyBuildingCard.getBoundingClientRect();
      const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);

      // Check if card is in viewport
      if (!(rect.bottom < 0 || rect.top - viewHeight >= 0)) {
        if (!animated) {
          progressFill.style.width = `${targetProgress}%`;
          animated = true;
          window.removeEventListener('scroll', animateProgress);
        }
      }
    };

    window.addEventListener('scroll', animateProgress);
    // Run once on load
    animateProgress();
  }

  // --- Simple Reveal Animations for Dashboard Feel ---
  const cards = document.querySelectorAll('.dashboard-card, .timeline-item, .skill-card, .currently-building-widget, .pill-badge');
  const revealOnScroll = () => {
    const viewHeight = window.innerHeight;
    let visibleCount = 0;
    
    cards.forEach(card => {
      if (card.style.opacity === '1') return;
      
      const rect = card.getBoundingClientRect();
      if (rect.top < viewHeight - 50 && rect.bottom > 0) {
        card.style.transitionDelay = `${visibleCount * 0.08}s`;
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        visibleCount++;
        
        setTimeout(() => {
          card.style.transitionDelay = '';
        }, 600 + (visibleCount * 80));
      }
    });
  };

  // Set initial styles for reveal animation
  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(15px)';
    card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
  });

  window.addEventListener('scroll', revealOnScroll);
  // Run once initially with a small delay
  setTimeout(revealOnScroll, 200);

  // --- Quick Stats Popups (Modals) ---
  const statCards = document.querySelectorAll('.stat-card');
  const modalOverlay = document.getElementById('stat-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalContent = document.getElementById('modal-content');
  const modalClose = document.getElementById('modal-close');

  if (statCards.length > 0 && modalOverlay && modalTitle && modalContent && modalClose) {

    // Close modal function
    const closeModal = () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });

    // Content templates for each index
    const modalTemplates = [
      // Index 0: About me
      {
        title: "ABOUT ME",
        content: `
          <div class="modal-table-container">
            <table class="info-table">
              <tbody>
                <tr>
                  <th scope="row">Name</th>
                  <td>Jotham L. Pahamutang</td>
                </tr>
                <tr>
                  <th scope="row">Gender</th>
                  <td>Male</td>
                </tr>
                <tr>
                  <th scope="row">Age</th>
                  <td>21</td>
                </tr>
                <tr>
                  <th scope="row">Birthdate</th>
                  <td>April 21, 2005</td>
                </tr>
                <tr>
                  <th scope="row">School</th>
                  <td>JH Cerilles State College</td>
                </tr>
                <tr>
                  <th scope="row">Course & Year</th>
                  <td>Bachelor of Science in Information Technology – 4th Year</td>
                </tr>
                <tr>
                  <th scope="row">Address</th>
                  <td>Dalapan, Guipos, Zamboanga del Sur</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      // Index 1: Hobbies & Favorites
      {
        title: "HOBBIES & FAVORITES",
        content: `
          <div class="modal-table-container">
            <table class="info-table">
              <tbody>
                <tr>
                  <th scope="row">Hobbies</th>
                  <td>Gaming, Listening to Music, Basketball & Volleyball, Coffee Lover</td>
                </tr>
                <tr>
                  <th scope="row">Passionate About</th>
                  <td>Online Games</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Sports</th>
                  <td>Basketball</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Food</th>
                  <td>Chicken Sandwich</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Music</th>
                  <td>Totoong Tayo by Jin DC</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Color</th>
                  <td>White & Black</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Drink</th>
                  <td>Iced Americano</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Movie</th>
                  <td>Anime – Bleach</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Online Game</th>
                  <td>Mobile Legends</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Fruit</th>
                  <td>Watermelon</td>
                </tr>
                <tr>
                  <th scope="row">Favorite Pet</th>
                  <td>Cat</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      },
      // Index 2: Contact Me
      {
        title: "CONTACT INFORMATION",
        content: `
          <div class="modal-table-container">
            <table class="info-table">
              <tbody>
                <tr>
                  <th scope="row">Email</th>
                  <td><a href="mailto:jothampahamutang@gmail.com" style="color: var(--accent-color);">jothampahamutang@gmail.com</a></td>
                </tr>
                <tr>
                  <th scope="row">Contact Number</th>
                  <td><a href="tel:09071760408" style="color: var(--accent-color); font-weight: 600;">09071760408</a></td>
                </tr>
                <tr>
                  <th scope="row">Address</th>
                  <td>Dalapan, Guipos, Zamboanga del Sur</td>
                </tr>
              </tbody>
            </table>
          </div>
        `
      }
    ];

    // Card click listeners
    statCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const template = modalTemplates[index];
        if (template) {
          modalTitle.textContent = template.title;
          modalContent.innerHTML = template.content;

          // Re-initialize Lucide icons within injected content
          lucide.createIcons();

          // Open Modal
          modalOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';
        }
      });
    });
  }

  // --- Document Viewer Logic for Activities Tab (docx-preview) ---
  const viewActivityBtns = document.querySelectorAll('.view-activity-btn');
  const docViewerModal = document.getElementById('doc-viewer-modal');
  const docPaperContent = document.getElementById('doc-paper-content');
  const docCloseBtn = document.getElementById('doc-close-btn');
  const zoomInBtn = document.getElementById('zoom-in-btn');
  const zoomOutBtn = document.getElementById('zoom-out-btn');
  const zoomResetBtn = document.getElementById('zoom-reset-btn');
  const zoomPercentage = document.getElementById('zoom-percentage');
  const docPaperWrapper = document.getElementById('doc-paper-wrapper');
  const docPrintBtn = document.getElementById('doc-print-btn');
  const docDownloadBtn = document.getElementById('doc-download-btn');
  let activeDocPath = null; // track the currently open file for download

  if (viewActivityBtns.length > 0 && docViewerModal && docPaperContent) {
    // Zoom levels list
    const zoomScales = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 1.75, 2.0];
    let currentZoomIndex = 3; // 100% by default

    const updateZoom = () => {
      const scale = zoomScales[currentZoomIndex];
      if (docPaperWrapper) {
        docPaperWrapper.style.transform = `scale(${scale})`;
      }
      if (zoomPercentage) {
        zoomPercentage.textContent = `${Math.round(scale * 100)}%`;
      }
    };

    const showDocLoading = () => {
      docPaperContent.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:400px; gap:16px; color:var(--text-secondary);">
          <svg style="width:40px;height:40px;animation:spin 1s linear infinite;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent-color)"/>
          </svg>
          <span class="doc-loading-text">Loading document…</span>
        </div>`;
    };

    // --- PDF rendering helper (multi-page canvas via PDF.js) ---
    const renderPdfInViewer = (pdfPath) => {
      if (typeof pdfjsLib === 'undefined') {
        docPaperContent.innerHTML = `
          <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;color:#c0392b;font-weight:600;padding:20px;text-align:center;">
            <p>PDF viewer library not loaded.</p>
            <p style="font-size:0.85rem;font-weight:normal;margin-top:8px;color:var(--text-secondary);">Please use the Download button instead.</p>
          </div>`;
        return;
      }

      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      const pageEl = document.getElementById('doc-page-indicator');
      const viewerBody = document.getElementById('doc-viewer-body');

      pdfjsLib.getDocument(encodeURI(pdfPath)).promise
        .then(pdf => {
          const totalPages = pdf.numPages;
          docPaperContent.innerHTML = ''; // Clear loader
          docPaperContent.classList.add('docx-fade-in');

          if (pageEl) {
            pageEl.style.display = totalPages > 1 ? 'block' : 'none';
            pageEl.textContent = `1 / ${totalPages}`;
          }

          // Render each page as a stacked canvas
          const canvases = [];
          const renderPage = (num) => pdf.getPage(num).then(page => {
            const viewport = page.getViewport({ scale: 2.0 });
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'margin: 0 auto 16px; display:flex; justify-content:center;';
            wrapper.setAttribute('data-page', num);

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.cssText = 'max-width:100%; height:auto; display:block; border-radius:4px; box-shadow:0 2px 12px rgba(0,0,0,0.10);';

            wrapper.appendChild(canvas);
            docPaperContent.appendChild(wrapper);
            canvases.push(wrapper);

            return page.render({ canvasContext: canvas.getContext('2d'), viewport }).promise;
          });

          // Render pages sequentially
          let chain = Promise.resolve();
          for (let i = 1; i <= totalPages; i++) {
            chain = chain.then(() => renderPage(i));
          }

          chain.then(() => {
            if (!pageEl || totalPages <= 1) return;
            // Scroll-based page indicator
            if (window._docPageObserver) window._docPageObserver.disconnect();
            const observer = new IntersectionObserver((entries) => {
              let top = null;
              entries.forEach(e => { if (!top || e.intersectionRatio > top.intersectionRatio) top = e; });
              if (top && top.isIntersecting) {
                pageEl.textContent = `${top.target.getAttribute('data-page')} / ${totalPages}`;
              }
            }, { root: viewerBody, threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) });
            canvases.forEach(c => observer.observe(c));
            window._docPageObserver = observer;
          });
        })
        .catch(err => {
          console.error('PDF.js error:', err);
          docPaperContent.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;color:#c0392b;font-weight:600;padding:20px;text-align:center;">
              <p>Failed to render PDF.</p>
              <p style="font-size:0.85rem;font-weight:normal;margin-top:8px;color:var(--text-secondary);">Error: ${err.message || err}</p>
              <p style="font-size:0.85rem;font-weight:normal;margin-top:8px;color:var(--text-secondary);">Please use the Download button to view the original file.</p>
            </div>`;
        });
    };

    // Open viewer
    viewActivityBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const docxPath = btn.getAttribute('data-docx');
        const pdfPath  = btn.getAttribute('data-pdf');
        const filePath = docxPath || pdfPath;
        const title = btn.getAttribute('data-title') || 'Document Viewer';

        // Update title
        const titleEl = document.getElementById('doc-viewer-title');
        if (titleEl) titleEl.textContent = title;

        // Reset zoom
        currentZoomIndex = 3;
        updateZoom();

        // Track active file path for the download button
        activeDocPath = filePath;

        // Open modal
        docViewerModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        showDocLoading();

        if (pdfPath) {
          // --- PDF branch ---
          renderPdfInViewer(pdfPath);
        } else if (docxPath) {
          // --- DOCX branch ---
          fetch(encodeURI(docxPath))
            .then(response => {
              if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
              return response.arrayBuffer();
            })
            .then(arrayBuffer => {
              docPaperContent.innerHTML = ''; // Clear loader
              return docx.renderAsync(arrayBuffer, docPaperContent, null, {
                ignoreLastRenderedPageBreak: false,
                breakPages: true,
                ignoreWidth: false,
                ignoreHeight: false
              });
            })
            .then(() => {
              docPaperContent.classList.add('docx-fade-in');
              const pageEl = document.getElementById('doc-page-indicator');
              const viewerBody = document.getElementById('doc-viewer-body');
              if (!pageEl) return;

              const pages = docPaperContent.querySelectorAll('section');
              const totalPages = pages.length;

              if (totalPages <= 1) { pageEl.style.display = 'none'; return; }

              pageEl.style.display = 'block';
              pageEl.textContent = `1 / ${totalPages}`;

              if (window._docPageObserver) window._docPageObserver.disconnect();

              const observer = new IntersectionObserver((entries) => {
                let topEntry = null;
                entries.forEach(entry => {
                  if (!topEntry || entry.intersectionRatio > topEntry.intersectionRatio) topEntry = entry;
                });
                if (topEntry && topEntry.isIntersecting) {
                  const idx = Array.from(pages).indexOf(topEntry.target) + 1;
                  if (idx > 0) pageEl.textContent = `${idx} / ${totalPages}`;
                }
              }, { root: viewerBody, threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) });

              pages.forEach(page => observer.observe(page));
              window._docPageObserver = observer;
            })
            .catch(error => {
              console.error('docx-preview error:', error);
              docPaperContent.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:300px;color:#c0392b;font-weight:600;padding:20px;text-align:center;">
                  <p>Failed to render document.</p>
                  <p style="font-size:0.85rem;font-weight:normal;margin-top:8px;color:var(--text-secondary);">Error details: ${error.message || error}</p>
                  <p style="font-size:0.85rem;font-weight:normal;margin-top:8px;color:var(--text-secondary);">Please use the Download button to download and view the original file.</p>
                </div>`;
            });
        }
      });
    });

    // Close viewer function
    const closeViewer = () => {
      docViewerModal.classList.remove('active');
      document.body.style.overflow = '';
      docPaperContent.innerHTML = ''; // Clear content to free up memory
      docPaperContent.classList.remove('docx-fade-in'); // Reset animation class
      // Reset page indicator
      const pageEl = document.getElementById('doc-page-indicator');
      if (pageEl) { pageEl.style.display = 'none'; pageEl.textContent = '1 / 1'; }
      // Disconnect page observer
      if (window._docPageObserver) { window._docPageObserver.disconnect(); window._docPageObserver = null; }
    };

    if (docCloseBtn) {
      docCloseBtn.addEventListener('click', closeViewer);
    }

    docViewerModal.addEventListener('click', (e) => {
      if (e.target === docViewerModal || e.target.classList.contains('doc-viewer-body')) {
        closeViewer();
      }
    });

    // Zoom Actions
    if (zoomInBtn) {
      zoomInBtn.addEventListener('click', () => {
        if (currentZoomIndex < zoomScales.length - 1) {
          currentZoomIndex++;
          updateZoom();
        }
      });
    }

    if (zoomOutBtn) {
      zoomOutBtn.addEventListener('click', () => {
        if (currentZoomIndex > 0) {
          currentZoomIndex--;
          updateZoom();
        }
      });
    }

    if (zoomResetBtn) {
      zoomResetBtn.addEventListener('click', () => {
        currentZoomIndex = 3;
        updateZoom();
      });
    }

    // Print functionality
    if (docPrintBtn) {
      docPrintBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // Download functionality — programmatically trigger download of the active file (docx or pdf)
    if (docDownloadBtn) {
      docDownloadBtn.addEventListener('click', () => {
        if (!activeDocPath) return;
        const anchor = document.createElement('a');
        anchor.href = activeDocPath;
        anchor.download = activeDocPath.split('/').pop() || 'document';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
      });
    }

    // Keyboard support (Escape to close, +/- to zoom)
    document.addEventListener('keydown', (e) => {
      if (!docViewerModal.classList.contains('active')) return;
      if (e.key === 'Escape') {
        closeViewer();
      } else if (e.key === '=' || e.key === '+') {
        if (currentZoomIndex < zoomScales.length - 1) {
          currentZoomIndex++;
          updateZoom();
        }
      } else if (e.key === '-') {
        if (currentZoomIndex > 0) {
          currentZoomIndex--;
          updateZoom();
        }
      }
    });
  }

  // --- Dynamic Activities List Sorting Logic ---
  const sortSelect = document.getElementById('activities-sort');
  const activitiesList = document.getElementById('activities-list');

  if (sortSelect && activitiesList) {
    sortSelect.addEventListener('change', () => {
      const val = sortSelect.value;
      const cards = Array.from(activitiesList.querySelectorAll('.activity-card'));

      // Fade out all cards
      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        card.style.transition = 'opacity 0.25s var(--ease-out-expo), transform 0.25s var(--ease-out-expo)';
      });

      setTimeout(() => {
        cards.sort((a, b) => {
          if (val === 'latest') {
            return b.getAttribute('data-date').localeCompare(a.getAttribute('data-date'));
          } else if (val === 'oldest') {
            return a.getAttribute('data-date').localeCompare(b.getAttribute('data-date'));
          } else if (val === 'az') {
            return a.getAttribute('data-title').localeCompare(b.getAttribute('data-title'));
          }
          return 0;
        });

        // Clear list and re-append in sorted order
        cards.forEach((card, index) => {
          activitiesList.appendChild(card);
          
          // Trigger reflow
          card.offsetHeight;
          
          // Fade in with stagger
          card.style.transition = 'opacity 0.4s var(--ease-out-expo), transform 0.4s var(--ease-out-expo)';
          card.style.transitionDelay = `${index * 0.06}s`;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          
          // Clean up styles after animation
          setTimeout(() => {
            card.style.transition = '';
            card.style.transitionDelay = '';
            card.style.opacity = '';
            card.style.transform = '';
          }, 500 + index * 60);
        });
      }, 250);
    });
  }

  // --- Certificate Lightbox Modal & PDF.js Canvas Renderer ---
  const certModalOverlay = document.getElementById('cert-modal');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalDownload = document.getElementById('cert-modal-download');
  const certModalClose = document.getElementById('cert-modal-close');
  const viewCertBtns = document.querySelectorAll('.view-cert-btn');

  if (certModalOverlay && certModalClose && viewCertBtns.length > 0) {
    const closeCertModal = () => {
      certModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    };

    const certPreviewContainer = document.querySelector('.cert-image-preview-container');

    const openCertModal = (btn) => {
      const imgSrc = btn.getAttribute('data-img');
      const title = btn.getAttribute('data-title') || 'Certificate';

      if (certModalTitle) certModalTitle.textContent = title;

      if (certPreviewContainer) {
        if (!imgSrc || imgSrc.trim() === '' || imgSrc === '#') {
          // Empty Placeholder State
          certPreviewContainer.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:14px; padding:60px 20px; text-align:center;">
              <div style="width:64px; height:64px; border-radius:50%; background:var(--bg-secondary, #F4F6F4); display:flex; align-items:center; justify-content:center; color:var(--text-secondary, #666);">
                <i data-lucide="file-x-2" style="width:32px; height:32px; opacity:0.6;"></i>
              </div>
              <h4 style="font-size:1.05rem; color:var(--text-primary); font-weight:600; margin-top:4px;">No Certificate File Attached</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary); max-width:300px; margin:0 auto; line-height:1.4;">This certificate slot is currently empty. You can replace this slot with your actual file later.</p>
            </div>`;
          if (certModalDownload) certModalDownload.style.display = 'none';
        } else {
          if (certModalDownload) certModalDownload.style.display = 'inline-flex';
          const cleanPath = imgSrc.split('?')[0].split('#')[0];
          const ext = cleanPath.substring(cleanPath.lastIndexOf('.') + 1).toLowerCase();

          if (ext === 'pdf') {
            // Render PDF onto HTML5 Canvas via PDF.js to eliminate browser PDF viewer chrome/dark borders
            certPreviewContainer.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; width:100%; height:100%;"><canvas id="pdf-render-canvas" style="max-width:100%; max-height:100%; width:auto; height:auto; object-fit:contain; border-radius:4px; box-shadow:0 4px 20px rgba(0,0,0,0.08);"></canvas></div>`;

            if (typeof pdfjsLib !== 'undefined') {
              pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
              pdfjsLib.getDocument(encodeURI(imgSrc)).promise.then(pdf => {
                pdf.getPage(1).then(page => {
                  const canvas = document.getElementById('pdf-render-canvas');
                  if (!canvas) return;
                  const ctx = canvas.getContext('2d');
                  const viewport = page.getViewport({ scale: 2.0 });

                  canvas.height = viewport.height;
                  canvas.width = viewport.width;

                  page.render({
                    canvasContext: ctx,
                    viewport: viewport
                  });
                });
              }).catch(err => {
                console.error("PDF render error:", err);
                certPreviewContainer.innerHTML = `<iframe src="${encodeURI(imgSrc)}#toolbar=0" style="width:100%; height:100%; border:none;" title="${title}"></iframe>`;
              });
            } else {
              certPreviewContainer.innerHTML = `<iframe src="${encodeURI(imgSrc)}#toolbar=0" style="width:100%; height:100%; border:none;" title="${title}"></iframe>`;
            }
          } else if (ext === 'docx' || ext === 'doc') {
            // Word document preview placeholder
            certPreviewContainer.innerHTML = `
              <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:16px; padding:40px; text-align:center;">
                <i data-lucide="file-text" style="width:64px; height:64px; color:var(--accent-color, #0891B2);"></i>
                <h4 style="font-size:1.1rem; color:var(--text-primary);">${title}</h4>
                <p style="font-size:0.85rem; color:var(--text-secondary);">Word Document (.${ext})</p>
              </div>`;
          } else {
            // Images (SVG, PNG, JPG, WEBP)
            certPreviewContainer.innerHTML = `<img id="cert-modal-img" src="${imgSrc}" alt="${title}" class="cert-modal-img">`;
          }

          if (certModalDownload && imgSrc) {
            certModalDownload.href = imgSrc;
            const exactFilename = btn.getAttribute('data-download') || imgSrc.split('/').pop().split('?')[0].split('#')[0];
            certModalDownload.setAttribute('download', exactFilename);
          }
        }
      }

      if (typeof lucide !== 'undefined') lucide.createIcons();

      certModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    viewCertBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openCertModal(btn);
      });
    });

    certModalClose.addEventListener('click', closeCertModal);
    certModalOverlay.addEventListener('click', (e) => {
      if (e.target === certModalOverlay) closeCertModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModalOverlay.classList.contains('active')) {
        closeCertModal();
      }
    });
  }
});


