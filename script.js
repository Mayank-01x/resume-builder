document.addEventListener('DOMContentLoaded', function () {
    
    // --- ELEMENT SELECTORS ---
    const form = document.querySelector('.lg\\:w-1\\/2');
    const resumePreview = document.getElementById('resume-preview');
    const templateSelect = document.getElementById('template-select');
    const downloadBtn = document.getElementById('download-pdf');

    // --- LIVE PREVIEW UPDATER ---
    form.addEventListener('input', function(e) {
        if (e.target.dataset.target) {
            const targetId = e.target.dataset.target;
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                // Special handling for the LinkedIn link
                if (targetId === 'resume-linkedin') {
                    targetElement.href = e.target.value;
                    targetElement.textContent = e.target.value ? e.target.value.replace(/^(https?:\/\/)?(www\.)?/, '') : 'LinkedIn';
                } else {
                    // For all other fields, just update the text content
                    targetElement.textContent = e.target.value;
                }
            }
        }
    });

    // --- DYNAMIC SECTION MANAGEMENT ---
    function createDynamicSection(type) {
        const listId = `${type}-list`;
        const resumeTargetId = `resume-${type}`;
        const addButtonId = `add-${type}`;

        const listContainer = document.getElementById(listId);
        const resumeContainer = document.getElementById(resumeTargetId);
        const addButton = document.getElementById(addButtonId);

        if (!listContainer || !resumeContainer || !addButton) {
            console.error(`Initialization failed for section type "${type}". Missing elements.`);
            return;
        }

        let itemCount = 0;

        // --- Function to add a new form entry ---
        const addEntry = () => {
            itemCount++;
            const entryDiv = document.createElement('div');
            entryDiv.className = `${type}-entry-form border p-4 rounded-md mb-4`;
            entryDiv.dataset.id = itemCount;

            let formHtml = '';
            // Generate the appropriate form fields based on the section type
            switch (type) {
                case 'experience':
                    formHtml = `
                        <input type="text" placeholder="Job Title / Project Name" class="w-full p-2 border rounded-md mb-2" data-type="jobTitle">
                        <input type="text" placeholder="Company / Team Size" class="w-full p-2 border rounded-md mb-2" data-type="company">
                        <div class="flex gap-2 mb-2">
                            <input type="text" placeholder="Start Date / Duration" class="w-1/2 p-2 border rounded-md" data-type="startDate">
                            <input type="text" placeholder="End Date / Environment" class="w-1/2 p-2 border rounded-md" data-type="endDate">
                        </div>
                        <textarea placeholder="Responsibilities & Achievements" class="w-full p-2 border rounded-md h-20" data-type="description"></textarea>
                    `;
                    break;
                case 'education':
                    formHtml = `
                        <input type="text" placeholder="Degree / Certificate" class="w-full p-2 border rounded-md mb-2" data-type="degree">
                        <input type="text" placeholder="Institution" class="w-full p-2 border rounded-md mb-2" data-type="institution">
                        <input type="text" placeholder="Session / Year" class="w-full p-2 border rounded-md mb-2" data-type="year">
                        <input type="text" placeholder="Score / Percentage" class="w-full p-2 border rounded-md mb-2" data-type="score">
                    `;
                    break;
                case 'skill':
                     formHtml = `<input type="text" placeholder="e.g., JavaScript" class="w-full p-2 border rounded-md" data-type="skillName">`;
                     break;
                case 'achievement':
                case 'certification':
                     formHtml = `<input type="text" placeholder="Describe achievement or certification" class="w-full p-2 border rounded-md" data-type="description">`;
                     break;
            }
            
            const removeBtnHtml = `<button class="remove-btn text-red-500 text-sm mt-2">Remove</button>`;
            entryDiv.innerHTML = formHtml + removeBtnHtml;
            listContainer.appendChild(entryDiv);

            // Add event listener to the new remove button
            entryDiv.querySelector('.remove-btn').addEventListener('click', () => {
                entryDiv.remove();
                updatePreview();
            });
        };
        
        // --- Function to update the resume preview ---
        const updatePreview = () => {
            resumeContainer.innerHTML = '';
            const formEntries = listContainer.querySelectorAll(`.${type}-entry-form`);
            
            if (type === 'skill') {
                formEntries.forEach(formEntry => {
                    const skillName = formEntry.querySelector('[data-type="skillName"]').value;
                    if (skillName) {
                        const skillSpan = document.createElement('span');
                        skillSpan.className = "bg-gray-200 text-gray-800 text-sm font-medium mr-2 mb-2 px-2.5 py-0.5 rounded";
                        skillSpan.textContent = skillName;
                        resumeContainer.appendChild(skillSpan);
                    }
                });
            } else if (type === 'achievement' || type === 'certification') {
                 const list = document.createElement('ul');
                 list.className = 'list-disc pl-5';
                 formEntries.forEach(formEntry => {
                    const description = formEntry.querySelector('[data-type="description"]').value;
                    if(description) {
                        const listItem = document.createElement('li');
                        listItem.textContent = description;
                        list.appendChild(listItem);
                    }
                 });
                 if (list.hasChildNodes()) {
                    resumeContainer.appendChild(list);
                 }
            } else {
                formEntries.forEach(formEntry => {
                    const previewEntry = document.createElement('div');
                    previewEntry.className = `${type}-entry`;

                    let previewHtml = '';
                    switch (type) {
                        case 'experience':
                            const jobTitle = formEntry.querySelector('[data-type="jobTitle"]').value;
                            const company = formEntry.querySelector('[data-type="company"]').value;
                            const startDate = formEntry.querySelector('[data-type="startDate"]').value;
                            const endDate = formEntry.querySelector('[data-type="endDate"]').value;
                            const description = formEntry.querySelector('[data-type="description"]').value.replace(/\n/g, '<br>');
                            previewHtml = `
                                <div class="flex justify-between items-baseline">
                                    <h3 class="font-semibold">${jobTitle || 'Job Title'}</h3>
                                    <p class="text-sm text-gray-600">${startDate || 'Start'} - ${endDate || 'End'}</p>
                                </div>
                                <p class="text-md font-medium text-gray-700">${company || 'Company'}</p>
                                <ul class="list-disc pl-5 mt-1 text-sm">${description ? `<li>${description.replace(/<br>/g, '</li><li>')}</li>` : '<li>Responsibilities...</li>'}</ul>
                            `;
                            break;
                        case 'education':
                            const degree = formEntry.querySelector('[data-type="degree"]').value;
                            const institution = formEntry.querySelector('[data-type="institution"]').value;
                            const year = formEntry.querySelector('[data-type="year"]').value;
                            const score = formEntry.querySelector('[data-type="score"]').value;
                            previewHtml = `
                                <div class="flex justify-between items-baseline">
                                    <h3 class="font-semibold">${degree || 'Degree'}</h3>
                                    <p class="text-sm text-gray-600">${year || 'Year'}</p>
                                </div>
                                <p class="text-md">${institution || 'Institution'}</p>
                                ${score ? `<p class="text-sm">Score: ${score}</p>` : ''}
                            `;
                            break;
                    }
                    previewEntry.innerHTML = previewHtml;
                    if(previewEntry.innerHTML.trim() !== '') resumeContainer.appendChild(previewEntry);
                });
            }
        };

        // --- EVENT LISTENERS for the section ---
        addButton.addEventListener('click', addEntry);
        listContainer.addEventListener('input', updatePreview);
        
        addEntry();
    }

    // Initialize all dynamic sections
    createDynamicSection('experience');
    createDynamicSection('education');
    createDynamicSection('skill');
    createDynamicSection('achievement');
    createDynamicSection('certification');

    // --- TEMPLATE SWITCHER ---
    templateSelect.addEventListener('change', function() {
        resumePreview.className = 'resume-preview ' + this.value;
    });

    // --- PDF DOWNLOADER ---
    downloadBtn.addEventListener('click', function() {
        const { jsPDF } = window.jspdf;
        const resumeContainer = document.getElementById('resume-preview-container');
        const resumeName = document.getElementById('name').value || "resume";
        
        downloadBtn.textContent = 'Generating PDF...';
        downloadBtn.disabled = true;

        html2canvas(resumeContainer, {
            scale: 2,
            useCORS: true, 
            logging: false,
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasHeight / canvasWidth;
            let height = pdfWidth * ratio;
            
            // This ensures the content fits on one page.
            height = height > pdfHeight ? pdfHeight : height; 

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, height);
            pdf.save(`${resumeName.replace(/\s+/g, '_').toLowerCase()}.pdf`);
            
            downloadBtn.textContent = 'Download as PDF';
            downloadBtn.disabled = false;
        }).catch(err => {
            console.error("Error generating PDF:", err);
            alert("Sorry, there was an error generating the PDF. Please try again.");
            downloadBtn.textContent = 'Download as PDF';
            downloadBtn.disabled = false;
        });
    });
});
