// Add animation classes to elements when they come into view
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.bg-white');
    
    // Add hover-scale class to all cards
    cards.forEach(card => {
        card.classList.add('hover-scale');
    });

    // Add click event listeners to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.bg-white');
            const title = card.querySelector('h2').textContent;
            alert(`You clicked on ${title}`);
        });
    });

    // Add smooth scroll to top button
    const scrollToTop = document.createElement('button');
    scrollToTop.innerHTML = '↑';
    scrollToTop.className = 'fixed bottom-4 right-4 bg-blue-500 text-white w-10 h-10 rounded-full shadow-lg hover:bg-blue-600 transition-colors';
    document.body.appendChild(scrollToTop);

    scrollToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Show/hide scroll to top button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTop.style.display = 'block';
        } else {
            scrollToTop.style.display = 'none';
        }
    });

    // Initialize scroll to top button as hidden
    scrollToTop.style.display = 'none';

    // Sample data
    const sampleData = {
        degrees: [
            { id: 'DEG001', fullName: 'Tiến sĩ Khoa học Máy tính', shortName: 'TS.KHMT' },
            { id: 'DEG002', fullName: 'Thạc sĩ Công nghệ Thông tin', shortName: 'ThS.CNTT' },
            { id: 'DEG003', fullName: 'Cử nhân Công nghệ Thông tin', shortName: 'CN.CNTT' }
        ],
        departments: [
            { id: 'DEPT001', fullName: 'Khoa Công nghệ Thông tin', shortName: 'CNTT', description: 'Đào tạo và nghiên cứu về công nghệ thông tin' },
            { id: 'DEPT002', fullName: 'Khoa Toán - Tin học', shortName: 'TOAN', description: 'Đào tạo và nghiên cứu về toán học và tin học' },
            { id: 'DEPT003', fullName: 'Khoa Điện tử - Viễn thông', shortName: 'DTVT', description: 'Đào tạo và nghiên cứu về điện tử và viễn thông' }
        ],
        teachers: [
            {
                id: 'GV001',
                fullName: 'Nguyễn Văn A',
                birthDate: '1980-01-01',
                phone: '0123456789',
                email: 'nguyenvana@example.com',
                departmentId: 'DEPT001',
                degreeId: 'DEG001'
            },
            {
                id: 'GV002',
                fullName: 'Trần Thị B',
                birthDate: '1985-05-15',
                phone: '0987654321',
                email: 'tranthib@example.com',
                departmentId: 'DEPT002',
                degreeId: 'DEG002'
            },
            {
                id: 'GV003',
                fullName: 'Lê Văn C',
                birthDate: '1975-12-30',
                phone: '0369852147',
                email: 'levanc@example.com',
                departmentId: 'DEPT003',
                degreeId: 'DEG003'
            }
        ]
    };

    // Generate new ID
    function generateId(prefix, existingIds) {
        const maxId = Math.max(...existingIds.map(id => parseInt(id.replace(prefix, ''))), 0);
        return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
    }

    // Modal handling
    const modal = document.getElementById('modal');
    const modalContent = modal.querySelector('.bg-white');
    let currentSection = 'Bằng cấp';
    let currentAction = 'add'; // 'add', 'edit', 'view'
    let currentItem = null;

    function showModal(section, action = 'add', item = null) {
        currentSection = section;
        currentAction = action;
        currentItem = item;
        
        let modalTitle = '';
        switch (action) {
            case 'add':
                modalTitle = 'Thêm mới';
                break;
            case 'edit':
                modalTitle = 'Chỉnh sửa';
                break;
            case 'view':
                modalTitle = 'Chi tiết';
                break;
        }
        
        modalContent.innerHTML = modalTemplates[section](modalTitle, action, item);
        modal.style.display = 'flex';
        modal.classList.add('modal-enter');
        setupModalEvents();
    }

    function hideModal() {
        modal.style.display = 'none';
        modal.classList.remove('modal-enter');
        const form = modalContent.querySelector('form');
        if (form) {
            form.reset();
        }
        currentItem = null;
    }

    function setupModalEvents() {
        const form = modalContent.querySelector('form');
        const cancelButton = modalContent.querySelector('button[type="button"]');
        
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());
                
                if (currentAction === 'add') {
                    // Generate new ID
                    const prefix = currentSection === 'Bằng cấp' ? 'DEG' : 
                                 currentSection === 'Khoa' ? 'DEPT' : 'GV';
                    const existingIds = sampleData[currentSection === 'Bằng cấp' ? 'degrees' : 
                                                 currentSection === 'Khoa' ? 'departments' : 'teachers']
                        .map(item => item.id);
                    data.id = generateId(prefix, existingIds);
                    
                    // Add to sample data
                    sampleData[currentSection === 'Bằng cấp' ? 'degrees' : 
                             currentSection === 'Khoa' ? 'departments' : 'teachers'].push(data);
                } else if (currentAction === 'edit') {
                    // Update existing item
                    const index = sampleData[currentSection === 'Bằng cấp' ? 'degrees' : 
                                          currentSection === 'Khoa' ? 'departments' : 'teachers']
                        .findIndex(item => item.id === currentItem.id);
                    if (index !== -1) {
                        sampleData[currentSection === 'Bằng cấp' ? 'degrees' : 
                                currentSection === 'Khoa' ? 'departments' : 'teachers'][index] = {
                            ...currentItem,
                            ...data
                        };
                    }
                }
                
                showToast(`${currentAction === 'add' ? 'Thêm mới' : 'Cập nhật'} thành công!`, 'success');
                hideModal();
                switchContent(currentSection); // Refresh content
            });
        }
        
        if (cancelButton) {
            cancelButton.addEventListener('click', hideModal);
        }

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });

        // Close modal when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                hideModal();
            }
        });
    }

    // Content templates
    const contentTemplates = {
        'Bằng cấp': () => `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Danh sách Bằng cấp</h2>
                <button class="bg-blue-500 text-white px-4 py-2 rounded">
                    <i class="fas fa-plus mr-2"></i>Thêm mới
                </button>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mb-6">
                <div class="flex gap-4">
                    <div class="flex-1">
                        <input type="text" placeholder="Tìm kiếm..." class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                    </div>
                    <button class="bg-gray-100 px-4 py-2 rounded">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đầy đủ</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên viết tắt</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${sampleData.degrees.map((degree, index) => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">${degree.id}</td>
                                <td class="px-6 py-4">${degree.fullName}</td>
                                <td class="px-6 py-4">${degree.shortName}</td>
                                <td class="px-6 py-4">
                                    <button type="button" class="view-btn text-blue-500 mr-3" data-id="${degree.id}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button type="button" class="edit-btn text-blue-500 mr-3" data-id="${degree.id}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button type="button" class="delete-btn text-red-500" data-id="${degree.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `,
        'Khoa': () => `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Danh sách Khoa</h2>
                <button class="bg-blue-500 text-white px-4 py-2 rounded">
                    <i class="fas fa-plus mr-2"></i>Thêm mới
                </button>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mb-6">
                <div class="flex gap-4">
                    <div class="flex-1">
                        <input type="text" placeholder="Tìm kiếm..." class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                    </div>
                    <button class="bg-gray-100 px-4 py-2 rounded">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đầy đủ</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên viết tắt</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả nhiệm vụ</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${sampleData.departments.map((dept, index) => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">${dept.id}</td>
                                <td class="px-6 py-4">${dept.fullName}</td>
                                <td class="px-6 py-4">${dept.shortName}</td>
                                <td class="px-6 py-4">${dept.description}</td>
                                <td class="px-6 py-4">
                                    <button type="button" class="view-btn text-blue-500 mr-3" data-id="${dept.id}">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button type="button" class="edit-btn text-blue-500 mr-3" data-id="${dept.id}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button type="button" class="delete-btn text-red-500" data-id="${dept.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `,
        'Giáo viên': () => `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Danh sách Giáo viên</h2>
                <button class="bg-blue-500 text-white px-4 py-2 rounded">
                    <i class="fas fa-plus mr-2"></i>Thêm mới
                </button>
            </div>
            <div class="bg-white p-4 rounded-lg shadow-md mb-6">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <input type="text" id="teacherSearch" placeholder="Tìm theo tên..." class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                    </div>
                    <div>
                        <select id="departmentFilter" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Chọn Khoa</option>
                            ${sampleData.departments.map(dept => `
                                <option value="${dept.id}">${dept.fullName}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <select id="degreeFilter" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Chọn Bằng cấp</option>
                            ${sampleData.degrees.map(degree => `
                                <option value="${degree.id}">${degree.fullName}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <button id="searchButton" class="w-full bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                            <i class="fas fa-search mr-2"></i>Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoa</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bằng cấp</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${sampleData.teachers.map((teacher, index) => {
                            const dept = sampleData.departments.find(d => d.id === teacher.departmentId);
                            const degree = sampleData.degrees.find(d => d.id === teacher.degreeId);
                            return `
                                <tr data-department-id="${teacher.departmentId}" data-degree-id="${teacher.degreeId}">
                                    <td class="px-6 py-4 whitespace-nowrap">${teacher.id}</td>
                                    <td class="px-6 py-4">${teacher.fullName}</td>
                                    <td class="px-6 py-4">${new Date(teacher.birthDate).toLocaleDateString('vi-VN')}</td>
                                    <td class="px-6 py-4">${teacher.email}</td>
                                    <td class="px-6 py-4">${dept ? dept.fullName : ''}</td>
                                    <td class="px-6 py-4">${degree ? degree.fullName : ''}</td>
                                    <td class="px-6 py-4">
                                        <button type="button" class="view-btn text-blue-500 mr-3" data-id="${teacher.id}">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button type="button" class="edit-btn text-blue-500 mr-3" data-id="${teacher.id}">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button type="button" class="delete-btn text-red-500" data-id="${teacher.id}">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `,
        'Thống kê': () => {
            // Calculate statistics
            const teacherCountByDept = {};
            const teacherCountByDegree = {};
            const retirementTeachers = [];

            sampleData.teachers.forEach(teacher => {
                // Count by department
                const dept = sampleData.departments.find(d => d.id === teacher.departmentId);
                if (dept) {
                    teacherCountByDept[dept.fullName] = (teacherCountByDept[dept.fullName] || 0) + 1;
                }

                // Count by degree
                const degree = sampleData.degrees.find(d => d.id === teacher.degreeId);
                if (degree) {
                    teacherCountByDegree[degree.fullName] = (teacherCountByDegree[degree.fullName] || 0) + 1;
                }

                // Check retirement
                const birthDate = new Date(teacher.birthDate);
                const age = new Date().getFullYear() - birthDate.getFullYear();
                if (age >= 60) {
                    const yearsToRetirement = 65 - age;
                    if (yearsToRetirement <= 5) {
                        retirementTeachers.push({
                            ...teacher,
                            yearsToRetirement
                        });
                    }
                }
            });

            return `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Thống kê Giáo viên</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-4">Số lượng giáo viên theo Khoa</h3>
                        <div class="space-y-4">
                            ${Object.entries(teacherCountByDept).map(([dept, count]) => `
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">${dept}</span>
                                    <span class="font-semibold">${count} giáo viên</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-4">Phân bố bằng cấp</h3>
                        <div class="space-y-4">
                            ${Object.entries(teacherCountByDegree).map(([degree, count]) => `
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">${degree}</span>
                                    <span class="font-semibold">${count} giáo viên</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="bg-white p-6 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold mb-4">Danh sách giáo viên sắp đến tuổi nghỉ hưu</h3>
                    <table class="min-w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STT</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Họ tên</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khoa</th>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian còn lại</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            ${retirementTeachers.map((teacher, index) => {
                                const dept = sampleData.departments.find(d => d.id === teacher.departmentId);
                                return `
                                    <tr>
                                        <td class="px-6 py-4">${index + 1}</td>
                                        <td class="px-6 py-4">${teacher.fullName}</td>
                                        <td class="px-6 py-4">${new Date(teacher.birthDate).toLocaleDateString('vi-VN')}</td>
                                        <td class="px-6 py-4">${dept ? dept.fullName : ''}</td>
                                        <td class="px-6 py-4">${teacher.yearsToRetirement} năm</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `;
        }
    };

    // Modal templates
    const modalTemplates = {
        'Bằng cấp': (title, action, item) => `
            <h3 class="text-xl font-bold mb-4">${title} Bằng cấp</h3>
            <form>
                ${action === 'view' ? `
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Mã</label>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg">${item.id}</div>
                    </div>
                ` : ''}
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Tên đầy đủ <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="fullName" value="${item ? item.fullName : ''}" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                           ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Tên viết tắt
                    </label>
                    <input type="text" name="shortName" value="${item ? item.shortName : ''}" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                           ${action === 'view' ? 'disabled' : ''}>
                </div>
                ${action !== 'view' ? `
                    <div class="flex justify-end gap-2">
                        <button type="button" class="px-4 py-2 border rounded">Hủy</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
                    </div>
                ` : ''}
            </form>
        `,
        'Khoa': (title, action, item) => `
            <h3 class="text-xl font-bold mb-4">${title} Khoa</h3>
            <form>
                ${action === 'view' ? `
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Mã</label>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg">${item.id}</div>
                    </div>
                ` : ''}
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Tên đầy đủ <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="fullName" value="${item ? item.fullName : ''}" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                           ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Tên viết tắt
                    </label>
                    <input type="text" name="shortName" value="${item ? item.shortName : ''}" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                           ${action === 'view' ? 'disabled' : ''}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Mô tả nhiệm vụ
                    </label>
                    <textarea name="description" rows="3" 
                              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                              ${action === 'view' ? 'disabled' : ''}>${item ? item.description : ''}</textarea>
                </div>
                ${action !== 'view' ? `
                    <div class="flex justify-end gap-2">
                        <button type="button" class="px-4 py-2 border rounded">Hủy</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
                    </div>
                ` : ''}
            </form>
        `,
        'Giáo viên': (title, action, item) => `
            <h3 class="text-xl font-bold mb-4">${title} Giáo viên</h3>
            <form>
                ${action === 'view' ? `
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Mã</label>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg">${item.id}</div>
                    </div>
                ` : ''}
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Họ tên <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="fullName" value="${item ? item.fullName : ''}" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                           ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Ngày sinh <span class="text-red-500">*</span>
                    </label>
                    <input type="date" name="birthDate" value="${item ? item.birthDate : ''}" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                           ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Điện thoại
                    </label>
                    <input type="tel" name="phone" value="${item ? item.phone : ''}" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                           ${action === 'view' ? 'disabled' : ''}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Email <span class="text-red-500">*</span>
                    </label>
                    <input type="email" name="email" value="${item ? item.email : ''}" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                           ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Thuộc khoa <span class="text-red-500">*</span>
                    </label>
                    <select name="departmentId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                            ${action === 'view' ? 'disabled' : 'required'}>
                        <option value="">Chọn khoa</option>
                        ${sampleData.departments.map(dept => `
                            <option value="${dept.id}" ${item && item.departmentId === dept.id ? 'selected' : ''}>
                                ${dept.fullName}
                            </option>
                        `).join('')}
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">
                        Bằng cấp <span class="text-red-500">*</span>
                    </label>
                    <select name="degreeId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                            ${action === 'view' ? 'disabled' : 'required'}>
                        <option value="">Chọn bằng cấp</option>
                        ${sampleData.degrees.map(degree => `
                            <option value="${degree.id}" ${item && item.degreeId === degree.id ? 'selected' : ''}>
                                ${degree.fullName}
                            </option>
                        `).join('')}
                    </select>
                </div>
                ${action !== 'view' ? `
                    <div class="flex justify-end gap-2">
                        <button type="button" class="px-4 py-2 border rounded">Hủy</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
                    </div>
                ` : ''}
            </form>
        `
    };

    // Content switching
    const mainContent = document.querySelector('main > div');
    const menuItems = document.querySelectorAll('nav a');

    function switchContent(section) {
        mainContent.innerHTML = contentTemplates[section]();
        setupContentEvents(section);
    }

    function setupContentEvents(section) {
        const addButton = mainContent.querySelector('button:has(i.fa-plus)');
        if (addButton) {
            addButton.addEventListener('click', () => showModal(section, 'add'));
        }

        // Setup search functionality for teacher tab
        if (section === 'Giáo viên') {
            const searchInput = document.getElementById('teacherSearch');
            const departmentFilter = document.getElementById('departmentFilter');
            const degreeFilter = document.getElementById('degreeFilter');
            const searchButton = document.getElementById('searchButton');

            function performTeacherSearch() {
                const searchTerm = searchInput.value.toLowerCase();
                const selectedDepartment = departmentFilter.value;
                const selectedDegree = degreeFilter.value;
                const rows = mainContent.querySelectorAll('tbody tr');

                rows.forEach(row => {
                    const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                    const email = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                    const department = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
                    const degree = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
                    const departmentId = row.getAttribute('data-department-id');
                    const degreeId = row.getAttribute('data-degree-id');

                    const matchesSearch = searchTerm === '' || 
                        name.includes(searchTerm) || 
                        email.includes(searchTerm);
                    
                    const matchesDepartment = selectedDepartment === '' || 
                        departmentId === selectedDepartment;
                    
                    const matchesDegree = selectedDegree === '' || 
                        degreeId === selectedDegree;

                    row.style.display = matchesSearch && matchesDepartment && matchesDegree ? '' : 'none';
                });
            }

            searchButton.addEventListener('click', performTeacherSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performTeacherSearch();
                }
            });
            departmentFilter.addEventListener('change', performTeacherSearch);
            degreeFilter.addEventListener('change', performTeacherSearch);
        }

        // Setup view buttons
        const viewButtons = mainContent.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const id = button.getAttribute('data-id');
                const dataKey = section === 'Bằng cấp' ? 'degrees' : 
                              section === 'Khoa' ? 'departments' : 'teachers';
                const item = sampleData[dataKey].find(item => item.id === id);
                if (item) {
                    showModal(section, 'view', item);
                }
            });
        });

        // Setup edit buttons
        const editButtons = mainContent.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const id = button.getAttribute('data-id');
                const dataKey = section === 'Bằng cấp' ? 'degrees' : 
                              section === 'Khoa' ? 'departments' : 'teachers';
                const item = sampleData[dataKey].find(item => item.id === id);
                if (item) {
                    showModal(section, 'edit', item);
                }
            });
        });

        // Setup delete buttons
        const deleteButtons = mainContent.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const id = button.getAttribute('data-id');
                if (confirm('Bạn có chắc chắn muốn xóa mục này?')) {
                    deleteItem(section, id);
                }
            });
        });

        const searchInput = mainContent.querySelector('input[type="text"]');
        const searchButton = mainContent.querySelector('button:has(i.fa-search)');
        
        if (searchInput && searchButton) {
            searchButton.addEventListener('click', () => performSearch(searchInput));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    performSearch(searchInput);
                }
            });
        }
    }

    function deleteItem(section, id) {
        const dataKey = section === 'Bằng cấp' ? 'degrees' : 
                       section === 'Khoa' ? 'departments' : 'teachers';
        const index = sampleData[dataKey].findIndex(item => item.id === id);
        if (index !== -1) {
            sampleData[dataKey].splice(index, 1);
            showToast('Xóa thành công!', 'success');
            switchContent(section);
        }
    }

    function performSearch(input) {
        const searchTerm = input.value.toLowerCase();
        const rows = mainContent.querySelectorAll('tbody tr');
        const section = document.querySelector('nav a.active span').textContent;
        
        rows.forEach(row => {
            let shouldShow = false;
            
            if (section === 'Giáo viên') {
                // Tìm kiếm theo tên, email, khoa và bằng cấp
                const name = row.querySelector('td:nth-child(2)').textContent.toLowerCase();
                const email = row.querySelector('td:nth-child(4)').textContent.toLowerCase();
                const department = row.querySelector('td:nth-child(5)').textContent.toLowerCase();
                const degree = row.querySelector('td:nth-child(6)').textContent.toLowerCase();
                
                shouldShow = name.includes(searchTerm) || 
                           email.includes(searchTerm) || 
                           department.includes(searchTerm) || 
                           degree.includes(searchTerm);
            } else {
                // Tìm kiếm cho các tab khác
                const text = row.textContent.toLowerCase();
                shouldShow = text.includes(searchTerm);
            }
            
            row.style.display = shouldShow ? '' : 'none';
        });
    }

    // Menu handling
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            menuItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            
            const section = item.querySelector('span').textContent;
            switchContent(section);
        });
    });

    // Toast notification
    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Initialize with default content
    switchContent('Bằng cấp');

    // Get all navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    
    // Add click event listeners to all navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Update content based on selected tab
            const tabName = this.querySelector('span').textContent;
            updateContent(tabName);
        });
    });
});

function updateContent(tabName) {
    const mainContent = document.querySelector('main .p-8');
    const header = mainContent.querySelector('.flex.justify-between');
    const title = header.querySelector('h2');
    
    // Update title based on selected tab
    title.textContent = `Danh sách ${tabName}`;
    
    // Ensure search section is always present
    if (!mainContent.querySelector('.bg-white.p-4.rounded-lg.shadow-md.mb-6')) {
        const searchSection = document.createElement('div');
        searchSection.className = 'bg-white p-4 rounded-lg shadow-md mb-6';
        searchSection.innerHTML = `
            <div class="flex gap-4">
                <div class="flex-1">
                    <input type="text" placeholder="Tìm kiếm..." class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                </div>
                <button class="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 transition-colors">
                    <i class="fas fa-search"></i>
                </button>
            </div>
        `;
        mainContent.insertBefore(searchSection, mainContent.querySelector('.bg-white.rounded-lg.shadow-md'));
    }
} 