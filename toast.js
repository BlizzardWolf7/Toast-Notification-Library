/*
 * Toast Notification Library
 * Copyright (C) 2025  Simon Ringwelski
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */


class ToastManager {
    constructor() {
        this.toasts = new Map();
        this.containers = new Map();
        this.maxToasts = 5;
        this.defaultDuration = 3000;
        this.toastCounter = 0;
        
        // Default configuration
        this.defaults = {
            type: 'info',
            position: 'top-right',
            duration: this.defaultDuration,
            close: true,
            stopOnFocus: true,
            newWindow: true,
            showTimerBar: true,
            customStyles: {}
        };
        
        // Toast type configurations
        this.typeConfig = {
            success: { icon: '✅', background: 'linear-gradient(135deg, #10b981, #059669)' },
            error: { icon: '❌', background: 'linear-gradient(135deg, #ef4444, #dc2626)' },
            warning: { icon: '⚠️', background: 'linear-gradient(135deg, #f59e0b, #d97706)' },
            info: { icon: 'ℹ️', background: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
            reminder: { icon: '🔔', background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
            custom: { icon: '💬', background: 'linear-gradient(135deg, #6b7280, #4b5563)' }
        };
        
        this.init();
    }
    
    init() {
        // Add global styles if not already present
        if (!document.getElementById('toast-styles')) {
            const link = document.createElement('link');
            link.id = 'toast-styles';
            link.rel = 'stylesheet';
            link.href = 'toast.css';
            document.head.appendChild(link);
        }
        
        // Handle keyboard events for accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearAll();
            }
        });
    }
    
    show(options) {
        if (!options || !options.text) {
            console.error('Toast: text is required');
            return null;
        }
        
        const config = { ...this.defaults, ...options };
        const toastId = ++this.toastCounter;
        
        // Limit number of toasts
        this.enforceMaxToasts(config.position);
        
        // Create or get container
        const container = this.getContainer(config.position);
        
        // Create toast element
        const toastElement = this.createToastElement(toastId, config);
        
        // Store toast data
        this.toasts.set(toastId, {
            element: toastElement,
            config: config,
            timer: null,
            timerBar: null,
            startTime: Date.now(),
            remainingTime: config.duration,
            isPaused: false
        });
        
        // Add to container
        container.appendChild(toastElement);
        
        // Trigger enter animation
        requestAnimationFrame(() => {
            this.animateIn(toastElement, config.position);
        });
        
        // Set up auto-dismiss timer
        if (config.duration > 0) {
            this.startTimer(toastId);
        }
        
        return toastId;
    }
    
    createToastElement(id, config) {
        const toast = document.createElement('div');
        toast.className = `toast-item ${config.type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'polite');
        toast.setAttribute('tabindex', '0');
        toast.dataset.toastId = id;
        
        // Apply custom styles
        if (config.customStyles) {
            this.applyCustomStyles(toast, config.customStyles);
        }
        
        // Make clickable if destination is provided
        if (config.destination) {
            toast.classList.add('clickable');
            toast.addEventListener('click', () => {
                if (config.newWindow) {
                    window.open(config.destination, '_blank', 'noopener,noreferrer');
                } else {
                    window.location.href = config.destination;
                }
            });
        }
        
        // Create content
        const content = document.createElement('div');
        content.className = 'toast-content';
        
        // Add icon
        const icon = document.createElement('span');
        icon.className = 'toast-icon';
        icon.textContent = config.customStyles?.icon || this.typeConfig[config.type]?.icon || '💬';
        content.appendChild(icon);
        
        // Add text
        const text = document.createElement('p');
        text.className = 'toast-text';
        text.textContent = config.text;
        content.appendChild(text);
        
        toast.appendChild(content);
        
        // Add close button
        if (config.close) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'toast-close';
            closeBtn.innerHTML = '×';
            closeBtn.setAttribute('aria-label', 'Close notification');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.dismiss(id);
            });
            toast.appendChild(closeBtn);
        }
        
        // Add timer bar - CRITICAL: Ensure proper mounting
        if (config.showTimerBar && config.duration > 0) {
            const timer = document.createElement('div');
            timer.className = 'toast-timer';
            timer.style.width = '100%';
            timer.style.transformOrigin = 'left center';
            
            // Add visual enhancement
            const timerInner = document.createElement('div');
            timerInner.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0.8));
                border-radius: inherit;
            `;
            timer.appendChild(timerInner);
            
            // Mount timer bar to toast element
            toast.appendChild(timer);
            
            // Debug logging
            console.log('Timer bar created and mounted:', {
                toastId: id,
                timerElement: timer,
                parentElement: toast,
                showTimerBar: config.showTimerBar,
                duration: config.duration
            });
        }
        
        // Handle hover events for pause/resume
        if (config.stopOnFocus && config.duration > 0) {
            toast.addEventListener('mouseenter', () => this.pauseTimer(id));
            toast.addEventListener('mouseleave', () => this.resumeTimer(id));
            toast.addEventListener('focus', () => this.pauseTimer(id));
            toast.addEventListener('blur', () => this.resumeTimer(id));
        }
        
        return toast;
    }
    
    applyCustomStyles(element, styles) {
        if (styles.background) element.style.background = styles.background;
        if (styles.color) element.style.color = styles.color;
        if (styles.fontSize) element.style.fontSize = styles.fontSize;
        if (styles.borderRadius) element.style.borderRadius = styles.borderRadius;
        if (styles.padding) element.style.padding = styles.padding;
        if (styles.boxShadow) element.style.boxShadow = styles.boxShadow;
        if (styles.animationSpeed) {
            element.style.transitionDuration = styles.animationSpeed;
        }
        if (styles.customClass) {
            element.classList.add(styles.customClass);
        }
    }
    
    getContainer(position) {
        if (!this.containers.has(position)) {
            const container = document.createElement('div');
            container.className = `toast-container ${position}`;
            document.body.appendChild(container);
            this.containers.set(position, container);
        }
        return this.containers.get(position);
    }
    
    enforceMaxToasts(position) {
        const container = this.containers.get(position);
        if (!container) return;
        
        const toasts = container.querySelectorAll('.toast-item');
        if (toasts.length >= this.maxToasts) {
            // Remove oldest toast
            const oldestToast = toasts[0];
            const toastId = parseInt(oldestToast.dataset.toastId);
            this.dismiss(toastId);
        }
    }
    
    animateIn(element, position) {
        element.classList.add('toast-enter');
        
        if (position.includes('left')) {
            element.classList.add('from-left');
        } else if (position === 'center') {
            element.classList.add('from-center');
        }
        
        requestAnimationFrame(() => {
            element.classList.remove('toast-enter', 'from-left', 'from-center');
            element.classList.add('toast-enter-active');
        });
    }
    
    animateOut(element, position, callback) {
        element.classList.add('toast-exit');
        
        requestAnimationFrame(() => {
            element.classList.remove('toast-exit');
            element.classList.add('toast-exit-active');
            
            if (position.includes('left')) {
                element.classList.add('to-left');
            } else if (position === 'center') {
                element.classList.add('to-center');
            }
        });
        
        setTimeout(() => {
            if (callback) callback();
        }, 300);
    }
    
    startTimer(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast || toast.config.duration <= 0) return;
        
        const timerBar = toast.element.querySelector('.toast-timer');
        if (timerBar) {
            // Store reference for pause/resume
            toast.timerBar = timerBar;
            
            // Reset and start animation
            timerBar.style.transition = 'none';
            timerBar.style.width = '100%';
            
            // Force reflow
            timerBar.offsetHeight;
            
            // Start the animation
            timerBar.style.transition = `width ${toast.remainingTime}ms linear`;
            timerBar.style.width = '0%';
            
            console.log('Timer animation started:', {
                toastId,
                duration: toast.remainingTime,
                timerBar: timerBar
            });
        }
        
        toast.timer = setTimeout(() => {
            this.dismiss(toastId);
        }, toast.remainingTime);
    }
    
    pauseTimer(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast || toast.isPaused) return;
        
        toast.isPaused = true;
        const elapsed = Date.now() - toast.startTime;
        toast.remainingTime = Math.max(0, toast.config.duration - elapsed);
        
        if (toast.timer) {
            clearTimeout(toast.timer);
            toast.timer = null;
        }
        
        const timerBar = toast.element.querySelector('.toast-timer');
        if (timerBar) {
            timerBar.classList.add('paused');
            // Preserve current width
            const currentWidth = timerBar.getBoundingClientRect().width;
            const parentWidth = timerBar.parentElement.getBoundingClientRect().width;
            const widthPercent = (currentWidth / parentWidth) * 100;
            timerBar.style.transition = 'none';
            timerBar.style.width = `${widthPercent}%`;
        }
    }
    
    resumeTimer(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast || !toast.isPaused) return;
        
        toast.isPaused = false;
        toast.startTime = Date.now();
        
        const timerBar = toast.element.querySelector('.toast-timer');
        if (timerBar) {
            timerBar.classList.remove('paused');
        }
        
        this.startTimer(toastId);
    }
    
    dismiss(toastId) {
        const toast = this.toasts.get(toastId);
        if (!toast) return;
        
        // Clear timer
        if (toast.timer) {
            clearTimeout(toast.timer);
        }
        
        // Animate out
        this.animateOut(toast.element, toast.config.position, () => {
            // Remove from DOM
            if (toast.element.parentNode) {
                toast.element.parentNode.removeChild(toast.element);
            }
            
            // Clean up container if empty
            const container = toast.element.parentNode;
            if (container && container.children.length === 0) {
                this.containers.delete(toast.config.position);
                container.remove();
            }
        });
        
        // Remove from tracking
        this.toasts.delete(toastId);
    }
    
    clearAll() {
        const toastIds = Array.from(this.toasts.keys());
        toastIds.forEach(id => this.dismiss(id));
    }
    
    // Utility methods
    success(text, options = {}) {
        return this.show({ ...options, text, type: 'success' });
    }
    
    error(text, options = {}) {
        return this.show({ ...options, text, type: 'error' });
    }
    
    warning(text, options = {}) {
        return this.show({ ...options, text, type: 'warning' });
    }
    
    info(text, options = {}) {
        return this.show({ ...options, text, type: 'info' });
    }
    
    reminder(text, options = {}) {
        return this.show({ ...options, text, type: 'reminder' });
    }
}

// Create global instance
const toastManager = new ToastManager();

// Global API
window.showToast = (options) => toastManager.show(options);
window.dismissToast = (id) => toastManager.dismiss(id);
window.clearAllToasts = () => toastManager.clearAll();

// Convenience methods
window.showToast.success = (text, options) => toastManager.success(text, options);
window.showToast.error = (text, options) => toastManager.error(text, options);
window.showToast.warning = (text, options) => toastManager.warning(text, options);
window.showToast.info = (text, options) => toastManager.info(text, options);
window.showToast.reminder = (text, options) => toastManager.reminder(text, options);