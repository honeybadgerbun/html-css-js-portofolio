function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// Enhanced email validation function
function isValidEmail(email) {
    console.log('Validating email:', email);
    
    // Simple and reliable email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Check basic format
    if (!emailRegex.test(email)) {
        console.log('Failed basic regex test');
        return false;
    }
    
    console.log('Passed basic regex test');
    
    // Check for common invalid patterns
    const invalidPatterns = [
        /^[^@]+@[^@]+\.con$/, // .con instead of .com
        /^[^@]+@[^@]+\.$/,    // ends with dot
        /^@[^@]+$/,           // starts with @
        /^[^@]+@$/,           // ends with @
        /^[^@]+@[^@]+\.{2,}/, // multiple consecutive dots
        /^\.+@/,              // starts with dots
        /@\.+/,               // @ followed by dots
        /\.+@/,               // dots before @
        /@\.+$/,              // @ followed by dots at end
    ];
    
    for (let pattern of invalidPatterns) {
        if (pattern.test(email)) {
            console.log('Failed invalid pattern test:', pattern);
            return false;
        }
    }
    
    console.log('Email validation passed');
    return true;
}

// Newsletter subscription handling with enhanced validation
function handleNewsletterSubmit(event) {
    event.preventDefault();
    
    console.log('Newsletter submit triggered');
    
    const emailInput = document.getElementById('newsletter-email');
    const messageDiv = document.getElementById('newsletter-message');
    const email = emailInput.value.trim();
    
    console.log('Email input:', email);
    
    // Clear any existing messages
    messageDiv.textContent = '';
    messageDiv.className = 'newsletter-message';
    
    // Check if email is empty
    if (!email) {
        console.log('Email is empty');
        showNewsletterMessage('Please enter an email address.', 'error');
        emailInput.focus();
        return;
    }
    
    console.log('Calling isValidEmail with:', email);
    // Enhanced email validation
    if (!isValidEmail(email)) {
        console.log('Email validation failed');
        showNewsletterMessage('Please enter a valid email address (e.g., john@gmail.com).', 'error');
        emailInput.focus();
        return;
    }
    
    // Check for duplicate subscription
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    if (subscribers.includes(email.toLowerCase())) {
        showNewsletterMessage('This email is already subscribed to our newsletter.', 'error');
        emailInput.focus();
        return;
    }
    
    // Show loading state
    showNewsletterMessage('Subscribing...', 'loading');
    
    // Simulate API call (replace with actual email service integration)
    setTimeout(() => {
        try {
            // Store email in localStorage for demo purposes
            // In a real implementation, you would send this to your email service
            subscribers.push(email.toLowerCase());
            localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
            
            showNewsletterMessage('Thank you for subscribing! You\'ll receive updates when new blog posts are published.', 'success');
            emailInput.value = '';
            
            // Log subscription for analytics
            console.log(`New newsletter subscription: ${email}`);
            
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
            showNewsletterMessage('Sorry, there was an error processing your subscription. Please try again.', 'error');
        }
    }, 1500);
}

function showNewsletterMessage(message, type) {
    const messageDiv = document.getElementById('newsletter-message');
    messageDiv.textContent = message;
    messageDiv.className = `newsletter-message ${type}`;
    
    // Clear message after 5 seconds for success/info, 8 seconds for errors
    const clearTime = (type === 'error') ? 8000 : 5000;
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'newsletter-message';
    }, clearTime);
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

// Admin page functions
function loadAdminStats() {
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    document.getElementById('subscriber-count').textContent = subscribers.length;
    
    const subscriberList = document.getElementById('subscriber-list');
    subscriberList.innerHTML = '';
    
    if (subscribers.length === 0) {
        subscriberList.innerHTML = '<p>No subscribers yet.</p>';
    } else {
        subscribers.forEach((email, index) => {
            const subscriberItem = document.createElement('div');
            subscriberItem.className = 'subscriber-item';
            subscriberItem.innerHTML = `
                <span>${index + 1}. ${email}</span>
                <button onclick="removeSubscriber('${email}')" class="btn btn-color-2">Remove</button>
            `;
            subscriberList.appendChild(subscriberItem);
        });
    }
}

function removeSubscriber(email) {
    const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
    const updatedSubscribers = subscribers.filter(sub => sub !== email);
    localStorage.setItem('newsletterSubscribers', JSON.stringify(updatedSubscribers));
    loadAdminStats();
    showAdminMessage(`Subscriber ${email} removed successfully.`, 'success');
}

function handleNewsletterSend(event) {
    event.preventDefault();
    
    const title = document.getElementById('blog-title').value.trim();
    const url = document.getElementById('blog-url').value.trim();
    
    if (!title || !url) {
        showAdminMessage('Please fill in both title and URL fields.', 'error');
        return;
    }
    
    showAdminMessage('Sending newsletter update...', 'loading');
    
    // Call the newsletter update function
    sendNewsletterUpdate(title, url);
    
    setTimeout(() => {
        showAdminMessage('Newsletter update sent successfully!', 'success');
        document.getElementById('newsletter-form').reset();
    }, 2000);
}

function showAdminMessage(message, type) {
    const messageDiv = document.getElementById('admin-message');
    messageDiv.textContent = message;
    messageDiv.className = `admin-message ${type}`;
    
    setTimeout(() => {
        messageDiv.textContent = '';
        messageDiv.className = 'admin-message';
    }, 5000);
}