/**
 * PDF.js helper utility
 * 
 * This file provides helper functions to load and display PDFs using PDF.js
 * In a real production app, you would include the full PDF.js library
 * For this demo, we'll simulate PDF interaction
 */

// Simple PDF viewer class
class PDFViewer {
    /**
     * Initialize a PDF viewer
     * @param {string} containerId - The ID of the container element
     * @param {boolean} editable - Whether the PDF should be editable
     */
    constructor(containerId, editable = false) {
        this.container = document.getElementById(containerId);
        this.editable = editable;
        this.currentPage = 1;
        this.pdfDocument = null;
        this.totalPages = 0;
        this.annotations = [];
        
        // Create viewer elements
        this.createViewerElements();
    }
    
    /**
     * Create the necessary elements for the PDF viewer
     */
    createViewerElements() {
        // Clear container
        this.container.innerHTML = '';
        
        // Create toolbar
        const toolbar = document.createElement('div');
        toolbar.className = 'pdf-toolbar';
        toolbar.innerHTML = `
            <div class="page-controls">
                <button class="prev-page">Previous</button>
                <span class="page-info">Page <span class="current-page">1</span> of <span class="total-pages">1</span></span>
                <button class="next-page">Next</button>
            </div>
            <div class="zoom-controls">
                <button class="zoom-in">+</button>
                <button class="zoom-out">-</button>
            </div>
        `;
        this.container.appendChild(toolbar);
        
        // Create canvas container
        const canvasContainer = document.createElement('div');
        canvasContainer.className = 'canvas-container';
        this.canvas = document.createElement('canvas');
        canvasContainer.appendChild(this.canvas);
        this.container.appendChild(canvasContainer);
        
        // Add event listeners
        toolbar.querySelector('.prev-page').addEventListener('click', () => this.prevPage());
        toolbar.querySelector('.next-page').addEventListener('click', () => this.nextPage());
        toolbar.querySelector('.zoom-in').addEventListener('click', () => this.zoomIn());
        toolbar.querySelector('.zoom-out').addEventListener('click', () => this.zoomOut());
        
        // If editable, create annotation layer
        if (this.editable) {
            this.createAnnotationLayer(canvasContainer);
        }
    }
    
    /**
     * Create the annotation layer for drawing
     */
    createAnnotationLayer(canvasContainer) {
        // Create annotation canvas that overlays the PDF canvas
        this.annotationCanvas = document.createElement('canvas');
        this.annotationCanvas.className = 'annotation-layer';
        canvasContainer.appendChild(this.annotationCanvas);
        
        // Set up the canvas context for drawing
        this.annotationCtx = this.annotationCanvas.getContext('2d');
        
        // Add event listeners for drawing
        let isDrawing = false;
        let lastX = 0;
        let lastY = 0;
        
        this.annotationCanvas.addEventListener('mousedown', (e) => {
            const rect = this.annotationCanvas.getBoundingClientRect();
            isDrawing = true;
            lastX = e.clientX - rect.left;
            lastY = e.clientY - rect.top;
        });
        
        this.annotationCanvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            
            const rect = this.annotationCanvas.getBoundingClientRect();
            const currentX = e.clientX - rect.left;
            const currentY = e.clientY - rect.top;
            
            // Draw line
            this.annotationCtx.beginPath();
            this.annotationCtx.moveTo(lastX, lastY);
            this.annotationCtx.lineTo(currentX, currentY);
            this.annotationCtx.stroke();
            
            // Save annotation
            this.annotations.push({
                type: 'line',
                page: this.currentPage,
                start: { x: lastX, y: lastY },
                end: { x: currentX, y: currentY },
                color: this.annotationCtx.strokeStyle,
                width: this.annotationCtx.lineWidth
            });
            
            // Update position
            lastX = currentX;
            lastY = currentY;
        });
        
        this.annotationCanvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
        
        this.annotationCanvas.addEventListener('mouseout', () => {
            isDrawing = false;
        });
    }
    
    /**
     * Load a PDF from URL
     * @param {string} url - The URL of the PDF to load
     */
    loadPDF(url) {
        // In a real implementation, this would use the PDF.js library
        // For this demo, we'll simulate loading a PDF
        
        // Simulate loading delay
        this.showLoadingMessage();
        
        setTimeout(() => {
            // Mock PDF document
            this.pdfDocument = {
                numPages: 5,
                getPage: (pageNumber) => {
                    return {
                        getViewport: () => ({ width: 800, height: 1100 }),
                        render: (renderContext) => {
                            // Simulate rendering by drawing a placeholder
                            const ctx = renderContext.canvasContext;
                            const canvas = ctx.canvas;
                            const width = canvas.width;
                            const height = canvas.height;
                            
                            // Clear canvas
                            ctx.fillStyle = 'white';
                            ctx.fillRect(0, 0, width, height);
                            
                            // Draw page border
                            ctx.strokeStyle = '#ddd';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(10, 10, width - 20, height - 20);
                            
                            // Draw page number
                            ctx.font = '24px sans-serif';
                            ctx.fillStyle = 'black';
                            ctx.textAlign = 'center';
                            ctx.fillText(`Page ${pageNumber} of PDF Document`, width / 2, 50);
                            
                            // Draw placeholder content
                            ctx.font = '16px sans-serif';
                            ctx.fillText(`This is a placeholder for PDF content`, width / 2, 100);
                            ctx.fillText(`In a real implementation, actual PDF content would be rendered here`, width / 2, 130);
                            
                            // Simulate completion
                            setTimeout(() => {
                                if (renderContext.complete) {
                                    renderContext.complete();
                                }
                            }, 100);
                            
                            return {
                                promise: Promise.resolve()
                            };
                        }
                    };
                }
            };
            
            this.totalPages = this.pdfDocument.numPages;
            this.updatePageInfo();
            
            // Render first page
            this.renderPage(1);
            
        }, 1000);
    }
    
    /**
     * Show loading message
     */
    showLoadingMessage() {
        const ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.font = '24px sans-serif';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('Loading PDF...', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    /**
     * Render a specific page
     * @param {number} pageNumber - The page number to render
     */
    renderPage(pageNumber) {
        if (!this.pdfDocument) return;
        
        this.currentPage = pageNumber;
        this.updatePageInfo();
        
        // Get the page
        const pdfPage = this.pdfDocument.getPage(pageNumber);
        
        // Get viewport
        const viewport = pdfPage.getViewport();
        
        // Set canvas size
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;
        
        // If we have an annotation canvas, set its size too
        if (this.annotationCanvas) {
            this.annotationCanvas.width = viewport.width;
            this.annotationCanvas.height = viewport.height;
            this.clearAnnotations();
            this.drawSavedAnnotations();
        }
        
        // Render the page
        const renderContext = {
            canvasContext: this.canvas.getContext('2d'),
            viewport: viewport
        };
        
        pdfPage.render(renderContext);
    }
    
    /**
     * Update page info in the toolbar
     */
    updatePageInfo() {
        const currentPageEl = this.container.querySelector('.current-page');
        const totalPagesEl = this.container.querySelector('.total-pages');
        
        if (currentPageEl) currentPageEl.textContent = this.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = this.totalPages;
    }
    
    /**
     * Navigate to the previous page
     */
    prevPage() {
        if (this.currentPage > 1) {
            this.renderPage(this.currentPage - 1);
        }
    }
    
    /**
     * Navigate to the next page
     */
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.renderPage(this.currentPage + 1);
        }
    }
    
    /**
     * Zoom in
     */
    zoomIn() {
        // Implementation would depend on PDF.js
        console.log('Zoom in functionality would be implemented with PDF.js');
    }
    
    /**
     * Zoom out
     */
    zoomOut() {
        // Implementation would depend on PDF.js
        console.log('Zoom out functionality would be implemented with PDF.js');
    }
    
    /**
     * Clear annotations on the current page
     */
    clearAnnotations() {
        if (this.annotationCtx) {
            this.annotationCtx.clearRect(0, 0, this.annotationCanvas.width, this.annotationCanvas.height);
        }
    }
    
    /**
     * Draw saved annotations for the current page
     */
    drawSavedAnnotations() {
        if (!this.annotationCtx) return;
        
        const pageAnnotations = this.annotations.filter(anno => anno.page === this.currentPage);
        
        pageAnnotations.forEach(anno => {
            if (anno.type === 'line') {
                this.annotationCtx.beginPath();
                this.annotationCtx.moveTo(anno.start.x, anno.start.y);
                this.annotationCtx.lineTo(anno.end.x, anno.end.y);
                this.annotationCtx.strokeStyle = anno.color;
                this.annotationCtx.lineWidth = anno.width;
                this.annotationCtx.stroke();
            }
        });
    }
    
    /**
     * Set the current drawing tool
     * @param {string} tool - The tool type ('pen', 'highlighter', 'eraser')
     * @param {string} color - The color to use
     */
    setTool(tool, color) {
        if (!this.annotationCtx) return;
        
        switch (tool) {
            case 'pen':
                this.annotationCtx.strokeStyle = color || '#000000';
                this.annotationCtx.lineWidth = 2;
                break;
            case 'highlighter':
                this.annotationCtx.strokeStyle = color || '#ffff00';
                this.annotationCtx.lineWidth = 10;
                this.annotationCtx.globalAlpha = 0.4;
                break;
            case 'eraser':
                this.annotationCtx.strokeStyle = '#ffffff';
                this.annotationCtx.lineWidth = 20;
                this.annotationCtx.globalAlpha = 1;
                break;
            default:
                this.annotationCtx.strokeStyle = '#000000';
                this.annotationCtx.lineWidth = 2;
                this.annotationCtx.globalAlpha = 1;
        }
    }
    
    /**
     * Get all annotations
     * @returns {Array} The annotations array
     */
    getAnnotations() {
        return this.annotations;
    }
    
    /**
     * Set annotations
     * @param {Array} annotations - The annotations to set
     */
    setAnnotations(annotations) {
        this.annotations = annotations || [];
        this.clearAnnotations();
        this.drawSavedAnnotations();
    }
} 