// Load header and footer components
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        const element = document.getElementById(elementId);
        if (element) {
            element.innerHTML = html;
            
            // If this is the header, customize logo and title if data attributes exist
            if (elementId === 'header-placeholder') {
                const logoSrc = element.getAttribute('data-logo');
                const siteTitle = element.getAttribute('data-title');
                
                // Determine if we are in a subfolder
                const path = window.location.pathname;
                const isInSubfolder = path.includes('/codes/');
                const basePath = isInSubfolder ? '../' : '';
                
                // Update all relative links in header to work from subfolders
                if (isInSubfolder) {
                    const links = element.querySelectorAll('a[href]');
                    links.forEach(link => {
                        const href = link.getAttribute('href');
                        // Only update if it's a relative link (not starting with http or #)
                        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('../')) {
                            link.setAttribute('href', '../' + href);
                        }
                    });
                    
                    // Update logo image path
                    const logoImage = element.querySelector('#logo-image');
                    if (logoImage) {
                        const src = logoImage.getAttribute('src');
                        if (src && !src.startsWith('../')) {
                            logoImage.setAttribute('src', '../' + src);
                        }
                    }
                }
                
                if (logoSrc) {
                    const logoElement = document.getElementById('logo-image');
                    if (logoElement) logoElement.src = logoSrc;
                }
                
                if (siteTitle) {
                    const titleElement = document.getElementById('site-title');
                    if (titleElement) titleElement.textContent = siteTitle;
                }
            }
            
            // If this is the footer, update logo path if in subfolder
            if (elementId === 'footer-placeholder') {
                const path = window.location.pathname;
                const isInSubfolder = path.includes('/codes/');
                
                if (isInSubfolder) {
                    const logoImage = element.querySelector('img[src*="Logo.png"]');
                    if (logoImage) {
                        const src = logoImage.getAttribute('src');
                        if (src && !src.startsWith('../')) {
                            logoImage.setAttribute('src', '../' + src);
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error(`Error loading ${componentPath}:`, error);
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    // Determine the base path based on current location
    const path = window.location.pathname;
    const isInSubfolder = path.includes('/codes/');
    const basePath = isInSubfolder ? '../' : '';
    
    await loadComponent('header-placeholder', basePath + 'header.html');
    await loadComponent('footer-placeholder', basePath + 'footer.html');
    
    // Update year in footer after it's loaded
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});
