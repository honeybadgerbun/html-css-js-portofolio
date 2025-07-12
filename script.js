function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Newsletter subscription handling
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    const emailInput = document.getElementById('newsletter-email');
    const messageDiv = document.getElementById('newsletter-message');
    const email = emailInput.value.trim();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNewsletterMessage('Please enter a valid email address.', 'error');
        return;
    }
    
    // Show loading state
    showNewsletterMessage('Subscribing...', 'loading');
    
    // Simulate API call (replace with actual email service integration)
    setTimeout(() => {
        // Store email in localStorage for demo purposes
        // In a real implementation, you would send this to your email service
        const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            showNewsletterMessage('Thank you for subscribing! You\'ll receive updates when new blog posts are published.', 'success');
            emailInput.value = '';
        } else {
            showNewsletterMessage('You\'re already subscribed!', 'info');
        }
    }, 1500);
}

function showNewsletterMessage(message, type) {
    const messageDiv = document.getElementById('newsletter-message');
    messageDiv.textContent = message;
    messageDiv.className = `newsletter-message ${type}`;
    
    // Clear message after 5 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'newsletter-message';
    }, 5000);
}

// Function to send newsletter updates (call this when new blog posts are published)
function sendNewsletterUpdate(blogPostTitle, blogPostUrl) {
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    
    if (subscribers.length === 0) {
        console.log('No subscribers to notify');
        return;
    }
    
    // In a real implementation, you would integrate with an email service like:
    // - Mailchimp
    // - SendGrid
    // - AWS SES
    // - EmailJS
    
    console.log(`Sending newsletter update to ${subscribers.length} subscribers`);
    console.log('Blog post:', blogPostTitle);
    console.log('URL:', blogPostUrl);
    console.log('Subscribers:', subscribers);
    
    // Example email service integration (pseudo-code):
    /*
    subscribers.forEach(email => {
        sendEmail({
            to: email,
            subject: 'New Blog Post: ' + blogPostTitle,
            body: `Check out my latest blog post: ${blogPostTitle}\n\nRead more: ${blogPostUrl}`
        });
    });
    */
}