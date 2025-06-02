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
        ],
        courses: [
            { id: 'HP001', name: 'Lập trình Cơ bản', credits: 3, coefficient: 1.0, periods: 45 },
            { id: 'HP002', name: 'Cơ sở Dữ liệu', credits: 3, coefficient: 1.2, periods: 45 },
            { id: 'HP003', name: 'Mạng máy tính', credits: 2, coefficient: 1.1, periods: 30 }
        ],
        semesters: [
            { id: 'HK20231', name: 'Học kỳ 1', year: '2023-2024', startDate: '2023-09-01', endDate: '2024-01-15' },
            { id: 'HK20232', name: 'Học kỳ 2', year: '2023-2024', startDate: '2024-02-01', endDate: '2024-06-15' }
        ],
        classSections: [
            { id: 'LHP001', semesterId: 'HK20231', courseId: 'HP001', code: '21CLC1', name: 'Lập trình Cơ bản 1', studentCount: 50 },
            { id: 'LHP002', semesterId: 'HK20231', courseId: 'HP002', code: '21CLC2', name: 'Cơ sở Dữ liệu 1', studentCount: 45 }
        ],
        assignments: [
            { id: 'PC001', classSectionId: 'LHP001', teacherId: 'GV001' },
            { id: 'PC002', classSectionId: 'LHP002', teacherId: 'GV002' }
        ]
    };

    // Generate new ID
    function generateId(prefix, existingIds) {
        const maxId = Math.max(...existingIds.map(id => parseInt(id.replace(prefix, ''))), 0);
        return `${prefix}${String(maxId + 1).padStart(3, '0')}`;
    }

    // Calculate class coefficient based on student count
    function calculateClassCoefficient(studentCountInput) {
        const studentCount = Number(studentCountInput) || 0; // Ensure studentCount is a number, default to 0
        if (studentCount < 20) return -0.3;
        if (studentCount <= 29) return -0.2; // Covers 20-29
        if (studentCount <= 39) return -0.1; // Covers 30-39
        // For studentCount >= 40
        // Base coefficient is 0 for 40-49 students.
        // For every 10 students from 40 upwards, coefficient increases by 0.1.
        const coefficient = Math.floor((studentCount - 40) / 10) * 0.1;
        return parseFloat(coefficient.toFixed(1)); // Ensure one decimal place and numeric type
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
                
                let prefix, dataKey;
                switch (currentSection) {
                    case 'Bằng cấp':
                        prefix = 'DEG'; dataKey = 'degrees'; break;
                    case 'Khoa':
                        prefix = 'DEPT'; dataKey = 'departments'; break;
                    case 'Giáo viên':
                        prefix = 'GV'; dataKey = 'teachers'; break;
                    case 'Học phần':
                        prefix = 'HP'; dataKey = 'courses'; break;
                    case 'Kì học':
                        prefix = 'HK'; dataKey = 'semesters'; break;
                    case 'Lớp học phần':
                        prefix = 'LHP'; dataKey = 'classSections'; break;
                    case 'Phân công giảng viên':
                        prefix = 'PC'; dataKey = 'assignments'; break;
                    default:
                        prefix = ''; dataKey = '';
                }
                if (currentAction === 'add') {
                    // Generate new ID
                    const existingIds = sampleData[dataKey].map(item => item.id);
                    data.id = generateId(prefix, existingIds);
                    // Đặc biệt cho lớp học phần: nếu chưa có code thì tự sinh
                    if (dataKey === 'classSections' && !data.code) {
                        data.code = data.id;
                    }
                    sampleData[dataKey].push(data);
                } else if (currentAction === 'edit') {
                    const index = sampleData[dataKey].findIndex(item => item.id === currentItem.id);
                    if (index !== -1) {
                        sampleData[dataKey][index] = { ...currentItem, ...data };
                    }
                }
                showToast(`${currentAction === 'add' ? 'Thêm mới' : 'Cập nhật'} thành công!`, 'success');
                hideModal();
                switchContent(currentSection);
            });
        }
        if (cancelButton) {
            cancelButton.addEventListener('click', hideModal);
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideModal();
            }
        });
        // Add keydown listener for Escape key, ensuring it's only added once or managed
        const escapeKeyListener = (e) => {
            if (e.key === 'Escape') {
                hideModal();
                document.removeEventListener('keydown', escapeKeyListener); // Clean up listener
            }
        };
        document.addEventListener('keydown', escapeKeyListener);
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
        'Thống kê giáo viên': () => {
            // Calculate statistics
            const teacherCountByDept = {};
            const teacherCountByDegree = {};
            const retirementTeachers = [];
            const ageDistribution = {
                'Dưới 30': 0,
                '30-39': 0,
                '40-49': 0,
                '50-59': 0,
                'Trên 60': 0
            };
            let totalAge = 0;

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

                // Calculate age and distribution
                const birthDate = new Date(teacher.birthDate);
                const age = new Date().getFullYear() - birthDate.getFullYear();
                totalAge += age;

                // Update age distribution
                if (age < 30) ageDistribution['Dưới 30']++;
                else if (age < 40) ageDistribution['30-39']++;
                else if (age < 50) ageDistribution['40-49']++;
                else if (age < 60) ageDistribution['50-59']++;
                else ageDistribution['Trên 60']++;

                // Check retirement
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

            const averageAge = Math.round(totalAge / sampleData.teachers.length);

            return `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Thống kê Giáo viên</h2>
                </div>

                <!-- Filters -->
                <div class="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <select id="deptFilter" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="">Tất cả các khoa</option>
                                ${sampleData.departments.map(dept => `
                                    <option value="${dept.id}">${dept.fullName}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <select id="degreeFilter" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="">Tất cả các bằng cấp</option>
                                ${sampleData.degrees.map(degree => `
                                    <option value="${degree.id}">${degree.fullName}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <button id="applyFilter" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                <i class="fas fa-filter mr-2"></i>Áp dụng bộ lọc
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Statistics Overview -->
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

                <!-- Age Statistics -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-4">Thống kê độ tuổi</h3>
                        <div class="mb-4">
                            <p class="text-gray-600">Độ tuổi trung bình: <span class="font-semibold">${averageAge} tuổi</span></p>
                        </div>
                        <div class="space-y-4">
                            ${Object.entries(ageDistribution).map(([range, count]) => `
                                <div class="flex justify-between items-center">
                                    <span class="text-gray-600">${range}</span>
                                    <span class="font-semibold">${count} giáo viên</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bg-white p-6 rounded-lg shadow-md">
                        <h3 class="text-lg font-semibold mb-4">Danh sách giáo viên sắp đến tuổi nghỉ hưu</h3>
                        <div class="overflow-x-auto">
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
                    </div>
                </div>

                <!-- Export Buttons -->
                <div class="flex justify-end gap-4 mb-6">
                    <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                        <i class="fas fa-file-excel mr-2"></i>Xuất Excel
                    </button>
                    <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                        <i class="fas fa-file-pdf mr-2"></i>Xuất PDF
                    </button>
                </div>
            `;
        },
        'Học phần': () => `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Danh sách Học phần</h2>
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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã số</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học phần</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tín chỉ</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hệ số</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiết</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${sampleData.courses.map(course => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">${course.id}</td>
                                <td class="px-6 py-4">${course.name}</td>
                                <td class="px-6 py-4">${course.credits}</td>
                                <td class="px-6 py-4">${course.coefficient}</td>
                                <td class="px-6 py-4">${course.periods}</td>
                                <td class="px-6 py-4">
                                    <button type="button" class="view-btn text-blue-500 mr-3" data-id="${course.id}"><i class="fas fa-eye"></i></button>
                                    <button type="button" class="edit-btn text-blue-500 mr-3" data-id="${course.id}"><i class="fas fa-edit"></i></button>
                                    <button type="button" class="delete-btn text-red-500" data-id="${course.id}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `,
        'Kì học': () => `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Danh sách Kì học</h2>
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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên kì</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Năm học</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày bắt đầu</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày kết thúc</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${sampleData.semesters.map(sem => `
                            <tr>
                                <td class="px-6 py-4 whitespace-nowrap">${sem.name}</td>
                                <td class="px-6 py-4">${sem.year}</td>
                                <td class="px-6 py-4">${sem.startDate}</td>
                                <td class="px-6 py-4">${sem.endDate}</td>
                                <td class="px-6 py-4">
                                    <button type="button" class="view-btn text-blue-500 mr-3" data-id="${sem.id}"><i class="fas fa-eye"></i></button>
                                    <button type="button" class="edit-btn text-blue-500 mr-3" data-id="${sem.id}"><i class="fas fa-edit"></i></button>
                                    <button type="button" class="delete-btn text-red-500" data-id="${sem.id}"><i class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `,
        'Lớp học phần': () => `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Quản lý Lớp học phần</h2>
            </div>

            <!-- Year and Semester Selection -->
            <div class="bg-white p-4 rounded-lg shadow-md mb-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Năm học</label>
                        <select id="academicYearSelect" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Chọn năm học</option>
                            ${[...new Set(sampleData.semesters.map(sem => sem.year))].map(year => `
                                <option value="${year}">${year}</option>
                            `).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Kì học</label>
                        <select id="semesterSelect" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" disabled>
                            <option value="">Chọn kì học</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Course List -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="p-4 border-b">
                    <h3 class="text-lg font-semibold">Danh sách học phần</h3>
                </div>
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã học phần</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên học phần</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tín chỉ</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lớp</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số SV/lớp</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200" id="courseListBody">
                        ${sampleData.courses.map(course => `
                            <tr>
                                <td class="px-6 py-4">${course.id}</td>
                                <td class="px-6 py-4">${course.name}</td>
                                <td class="px-6 py-4">${course.credits}</td>
                                <td class="px-6 py-4">
                                    <input type="number" min="1" max="10" class="w-20 px-2 py-1 border rounded" 
                                           data-course-id="${course.id}" data-field="classCount">
                                </td>
                                <td class="px-6 py-4">
                                    <input type="number" min="1" max="100" class="w-20 px-2 py-1 border rounded" 
                                           data-course-id="${course.id}" data-field="studentCount">
                                </td>
                                <td class="px-6 py-4">
                                    <button class="create-classes-btn bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" 
                                            data-course-id="${course.id}">
                                        Tạo lớp
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Created Classes List -->
            <div class="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
                <div class="p-4 border-b">
                    <h3 class="text-lg font-semibold">Danh sách lớp đã tạo</h3>
                </div>
                <table class="min-w-full">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã lớp</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên lớp</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Học phần</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số SV</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hệ số lớp</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200" id="createdClassesBody">
                    </tbody>
                </table>
            </div>
        `,
        'Phân công giảng viên': () => `
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-2xl font-bold text-gray-800">Phân công giảng viên</h2>
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
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lớp học phần</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giảng viên</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${sampleData.assignments.map(assign => {
                            const cls = sampleData.classSections.find(c => c.id === assign.classSectionId);
                            const teacher = sampleData.teachers.find(t => t.id === assign.teacherId);
                            return `
                                <tr>
                                    <td class="px-6 py-4">${cls ? cls.name : ''}</td>
                                    <td class="px-6 py-4">${teacher ? teacher.fullName : ''}</td>
                                    <td class="px-6 py-4">
                                        <button type="button" class="view-btn text-blue-500 mr-3" data-id="${assign.id}"><i class="fas fa-eye"></i></button>
                                        <button type="button" class="edit-btn text-blue-500 mr-3" data-id="${assign.id}"><i class="fas fa-edit"></i></button>
                                        <button type="button" class="delete-btn text-red-500" data-id="${assign.id}"><i class="fas fa-trash"></i></button>
                                    </td>
                                </tr>
                            `;
                        }).join('')}
                    </tbody>
                </table>
            </div>
        `,
        'Thống kê lớp mở': () => {
            // Get unique academic years from semesters
            const academicYears = [...new Set(sampleData.semesters.map(sem => sem.year))];
            
            // Get departments that manage courses
            const departments = sampleData.departments;

            return `
                <div class="mb-6">
                    <h2 class="text-2xl font-bold text-gray-800">Thống kê số lớp mở cho các học phần trong năm học</h2>
                </div>

                <!-- Filters -->
                <div class="bg-white p-4 rounded-lg shadow-md mb-6">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Năm học</label>
                            <select id="academicYearFilter" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="">Chọn năm học</option>
                                ${academicYears.map(year => `
                                    <option value="${year}">${year}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Khoa/Bộ môn</label>
                            <select id="departmentFilter" class="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="">Tất cả các khoa</option>
                                ${departments.map(dept => `
                                    <option value="${dept.id}">${dept.fullName}</option>
                                `).join('')}
                            </select>
                        </div>
                        <div class="flex items-end">
                            <button id="applyFilter" class="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                <i class="fas fa-filter mr-2"></i>Áp dụng bộ lọc
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Statistics Table -->
                <div class="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                    <div class="p-4 border-b">
                        <div class="flex justify-between items-center">
                            <h3 class="text-lg font-semibold">Danh sách lớp học phần</h3>
                            <div class="flex gap-2">
                                <button class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                                    <i class="fas fa-file-excel mr-2"></i>Xuất Excel
                                </button>
                                <button class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                                    <i class="fas fa-file-pdf mr-2"></i>Xuất PDF
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="min-w-full">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                        STT
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                        Mã học phần
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                        Tên học phần
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                        Số lớp đã mở
                                    </th>
                                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100">
                                        Tổng số sinh viên
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200" id="statisticsTableBody">
                                <!-- Data will be populated dynamically -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Chart Section -->
                <div class="bg-white rounded-lg shadow-md p-6">
                    <h3 class="text-lg font-semibold mb-4">Biểu đồ top học phần có nhiều lớp mở nhất</h3>
                    <div class="h-80" id="statisticsChart">
                        <!-- Chart will be rendered here -->
                    </div>
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
        `,
        'Học phần': (title, action, item) => `
            <h3 class="text-xl font-bold mb-4">${title} Học phần</h3>
            <form>
                ${action === 'view' ? `
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Mã số</label>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg">${item.id}</div>
                    </div>
                ` : ''}
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Tên học phần <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="${item ? item.name : ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Số tín chỉ <span class="text-red-500">*</span></label>
                    <input type="number" name="credits" value="${item ? item.credits : ''}" 
                           min="1" max="10" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                           ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label for="coefficient" class="block text-gray-700 text-sm font-bold mb-2">Hệ số học phần</label>
                    <input type="number" id="coefficient" name="coefficient" 
                           value="${item ? item.coefficient : '1.0'}" 
                           min="1.0" max="1.5" step="0.01" 
                           class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" 
                           ${action === 'view' ? 'disabled' : ''}>
                    <p class="text-xs text-gray-500 mt-1">Mặc định: 1.0. Khoảng giá trị: 1.0–1.5.</p>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Số tiết</label>
                    <input type="number" name="periods" value="${item ? item.periods : ''}" 
                           min="15" max="120" step="1"
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
        'Kì học': (title, action, item) => `
            <h3 class="text-xl font-bold mb-4">${title} Kì học</h3>
            <form>
                ${action === 'view' ? `
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Mã kì</label>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg">${item.id}</div>
                    </div>
                ` : ''}
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Tên kì <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="${item ? item.name : ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Năm học <span class="text-red-500">*</span></label>
                    <input type="text" name="year" value="${item ? item.year : ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Ngày bắt đầu</label>
                    <input type="date" name="startDate" value="${item ? item.startDate : ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : ''}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Ngày kết thúc</label>
                    <input type="date" name="endDate" value="${item ? item.endDate : ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : ''}>
                </div>
                ${action !== 'view' ? `
                    <div class="flex justify-end gap-2">
                        <button type="button" class="px-4 py-2 border rounded">Hủy</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
                    </div>
                ` : ''}
            </form>
        `,
        'Lớp học phần': (title, action, item) => `
            <h3 class="text-xl font-bold mb-4">${title} Lớp học phần</h3>
            <form>
                ${action === 'view' ? `
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2">Mã lớp</label>
                        <div class="px-3 py-2 bg-gray-50 rounded-lg">${item.code}</div>
                    </div>
                ` : ''}
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Tên lớp <span class="text-red-500">*</span></label>
                    <input type="text" name="name" value="${item ? item.name : ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : 'required'}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Kì học <span class="text-red-500">*</span></label>
                    <select name="semesterId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : 'required'}>
                        <option value="">Chọn kì học</option>
                        ${sampleData.semesters.map(sem => `<option value="${sem.id}" ${item && item.semesterId === sem.id ? 'selected' : ''}>${sem.name} ${sem.year}</option>`).join('')}
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Học phần <span class="text-red-500">*</span></label>
                    <select name="courseId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : 'required'}>
                        <option value="">Chọn học phần</option>
                        ${sampleData.courses.map(course => `<option value="${course.id}" ${item && item.courseId === course.id ? 'selected' : ''}>${course.name}</option>`).join('')}
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Mã lớp</label>
                    <input type="text" name="code" value="${item ? item.code : ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : ''}>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Số sinh viên</label>
                    <input type="number" name="studentCount" value="${item ? item.studentCount : ''}" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : ''}>
                </div>
                ${action !== 'view' ? `
                    <div class="flex justify-end gap-2">
                        <button type="button" class="px-4 py-2 border rounded">Hủy</button>
                        <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">Lưu</button>
                    </div>
                ` : ''}
            </form>
        `,
        'Phân công giảng viên': (title, action, item) => `
            <h3 class="text-xl font-bold mb-4">${title} Phân công giảng viên</h3>
            <form>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Lớp học phần <span class="text-red-500">*</span></label>
                    <select name="classSectionId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : 'required'}>
                        <option value="">Chọn lớp học phần</option>
                        ${sampleData.classSections.map(cls => `<option value="${cls.id}" ${item && item.classSectionId === cls.id ? 'selected' : ''}>${cls.name}</option>`).join('')}
                    </select>
                </div>
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2">Giảng viên <span class="text-red-500">*</span></label>
                    <select name="teacherId" class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500" ${action === 'view' ? 'disabled' : 'required'}>
                        <option value="">Chọn giảng viên</option>
                        ${sampleData.teachers.map(teacher => `<option value="${teacher.id}" ${item && item.teacherId === teacher.id ? 'selected' : ''}>${teacher.fullName}</option>`).join('')}
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

        // Setup statistics filters
        if (section === 'Thống kê lớp mở') {
            const academicYearFilter = mainContent.querySelector('#academicYearFilter');
            const departmentFilter = mainContent.querySelector('#departmentFilter');
            const applyFilter = mainContent.querySelector('#applyFilter');
            const exportExcel = mainContent.querySelector('button:has(i.fa-file-excel)');
            const exportPDF = mainContent.querySelector('button:has(i.fa-file-pdf)');

            // Function to calculate statistics
            function calculateStatistics() {
                const selectedYear = academicYearFilter.value;
                const selectedDept = departmentFilter.value;

                // Get semesters for selected year
                const yearSemesters = sampleData.semesters.filter(sem => sem.year === selectedYear);
                const semesterIds = yearSemesters.map(sem => sem.id);

                // Get class sections for selected year
                const yearClassSections = sampleData.classSections.filter(cls => 
                    semesterIds.includes(cls.semesterId)
                );

                // Group by course
                const courseStats = {};
                yearClassSections.forEach(cls => {
                    const course = sampleData.courses.find(c => c.id === cls.courseId);
                    if (course) {
                        if (!courseStats[course.id]) {
                            courseStats[course.id] = {
                                course: course,
                                classCount: 0,
                                totalStudents: 0
                            };
                        }
                        courseStats[course.id].classCount++;
                        courseStats[course.id].totalStudents += cls.studentCount || 0;
                    }
                });

                // Convert to array and sort by class count
                const statsArray = Object.values(courseStats).sort((a, b) => b.classCount - a.classCount);

                // Update table
                const tableBody = mainContent.querySelector('#statisticsTableBody');
                if (tableBody) {
                    tableBody.innerHTML = statsArray.map((stat, index) => `
                        <tr>
                            <td class="px-6 py-4">${index + 1}</td>
                            <td class="px-6 py-4">${stat.course.id}</td>
                            <td class="px-6 py-4">${stat.course.name}</td>
                            <td class="px-6 py-4">${stat.classCount}</td>
                            <td class="px-6 py-4">${stat.totalStudents}</td>
                        </tr>
                    `).join('');
                }

                // Update chart (using Chart.js)
                const chartContainer = mainContent.querySelector('#statisticsChart');
                if (chartContainer) {
                    // Get top 5 courses
                    const topCourses = statsArray.slice(0, 5);
                    
                    // Create chart data
                    const chartData = {
                        labels: topCourses.map(stat => stat.course.name),
                        datasets: [{
                            label: 'Số lớp đã mở',
                            data: topCourses.map(stat => stat.classCount),
                            backgroundColor: 'rgba(59, 130, 246, 0.5)',
                            borderColor: 'rgb(59, 130, 246)',
                            borderWidth: 1
                        }]
                    };

                    // Create or update chart
                    if (window.statisticsChart) {
                        window.statisticsChart.destroy();
                    }
                    window.statisticsChart = new Chart(chartContainer, {
                        type: 'bar',
                        data: chartData,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    ticks: {
                                        stepSize: 1
                                    }
                                }
                            }
                        }
                    });
                }
            }

            if (applyFilter) {
                applyFilter.addEventListener('click', calculateStatistics);
            }

            if (exportExcel) {
                exportExcel.addEventListener('click', () => {
                    // TODO: Implement Excel export
                    showToast('Chức năng xuất Excel đang được phát triển', 'info');
                });
            }

            if (exportPDF) {
                exportPDF.addEventListener('click', () => {
                    // TODO: Implement PDF export
                    showToast('Chức năng xuất PDF đang được phát triển', 'info');
                });
            }

            // Add sorting functionality to table headers
            const tableHeaders = mainContent.querySelectorAll('th');
            tableHeaders.forEach(header => {
                header.addEventListener('click', () => {
                    const column = header.textContent.trim();
                    const tableBody = mainContent.querySelector('#statisticsTableBody');
                    const rows = Array.from(tableBody.querySelectorAll('tr'));
                    
                    rows.sort((a, b) => {
                        const aValue = a.children[Array.from(header.parentElement.children).indexOf(header)].textContent;
                        const bValue = b.children[Array.from(header.parentElement.children).indexOf(header)].textContent;
                        
                        if (column === 'STT' || column === 'Số lớp đã mở' || column === 'Tổng số sinh viên') {
                            return parseInt(aValue) - parseInt(bValue);
                        }
                        return aValue.localeCompare(bValue);
                    });
                    
                    tableBody.innerHTML = '';
                    rows.forEach(row => tableBody.appendChild(row));
                });
            });
        }

        // Setup view/edit/delete for all sections
        const viewButtons = mainContent.querySelectorAll('.view-btn');
        viewButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const id = button.getAttribute('data-id');
                let dataKey;
                switch (section) {
                    case 'Bằng cấp': dataKey = 'degrees'; break;
                    case 'Khoa': dataKey = 'departments'; break;
                    case 'Giáo viên': dataKey = 'teachers'; break;
                    case 'Học phần': dataKey = 'courses'; break;
                    case 'Kì học': dataKey = 'semesters'; break;
                    case 'Lớp học phần': dataKey = 'classSections'; break;
                    case 'Phân công giảng viên': dataKey = 'assignments'; break;
                    default: dataKey = '';
                }
                const item = sampleData[dataKey].find(item => item.id === id);
                if (item) {
                    showModal(section, 'view', item);
                }
            });
        });
        const editButtons = mainContent.querySelectorAll('.edit-btn');
        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const id = button.getAttribute('data-id');
                let dataKey;
                switch (section) {
                    case 'Bằng cấp': dataKey = 'degrees'; break;
                    case 'Khoa': dataKey = 'departments'; break;
                    case 'Giáo viên': dataKey = 'teachers'; break;
                    case 'Học phần': dataKey = 'courses'; break;
                    case 'Kì học': dataKey = 'semesters'; break;
                    case 'Lớp học phần': dataKey = 'classSections'; break;
                    case 'Phân công giảng viên': dataKey = 'assignments'; break;
                    default: dataKey = '';
                }
                const item = sampleData[dataKey].find(item => item.id === id);
                if (item) {
                    showModal(section, 'edit', item);
                }
            });
        });
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
        // Search logic giữ nguyên
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

        if (section === 'Lớp học phần') {
            const academicYearSelect = mainContent.querySelector('#academicYearSelect');
            const semesterSelect = mainContent.querySelector('#semesterSelect');
            const courseListBody = mainContent.querySelector('#courseListBody');
            const createdClassesBody = mainContent.querySelector('#createdClassesBody');

            // Update semester options when year changes
            academicYearSelect.addEventListener('change', () => {
                const selectedYear = academicYearSelect.value;
                semesterSelect.disabled = !selectedYear;
                
                if (selectedYear) {
                    const yearSemesters = sampleData.semesters.filter(sem => sem.year === selectedYear);
                    semesterSelect.innerHTML = `
                        <option value="">Chọn kì học</option>
                        ${yearSemesters.map(sem => `
                            <option value="${sem.id}">${sem.name}</option>
                        `).join('')}
                    `;
                } else {
                    semesterSelect.innerHTML = '<option value="">Chọn kì học</option>';
                }
            });

            // Handle class creation
            courseListBody.addEventListener('click', (e) => {
                if (e.target.classList.contains('create-classes-btn')) {
                    const courseId = e.target.dataset.courseId;
                    const course = sampleData.courses.find(c => c.id === courseId);
                    const classCountInput = courseListBody.querySelector(`input[data-course-id="${courseId}"][data-field="classCount"]`);
                    const studentCountInput = courseListBody.querySelector(`input[data-course-id="${courseId}"][data-field="studentCount"]`);
                    
                    const classCount = parseInt(classCountInput.value) || 0;
                    const studentCount = parseInt(studentCountInput.value) || 0;
                    
                    if (!classCount || !studentCount) {
                        alert('Vui lòng nhập số lớp và số sinh viên');
                        return;
                    }

                    const selectedSemester = semesterSelect.value;
                    if (!selectedSemester) {
                        alert('Vui lòng chọn kì học');
                        return;
                    }

                    // Create classes
                    for (let i = 0; i < classCount; i++) {
                        const classId = generateId('LHP', sampleData.classSections.map(c => c.id));
                        const classCode = `${courseId}_${selectedSemester}_${String(i + 1).padStart(2, '0')}`;
                        
                        const newClass = {
                            id: classId,
                            semesterId: selectedSemester,
                            courseId: courseId,
                            code: classCode,
                            name: `${course.name} - Lớp ${i + 1}`,
                            studentCount: studentCount
                        };
                        
                        sampleData.classSections.push(newClass);
                    }

                    // Update created classes list
                    updateCreatedClassesList();
                    
                    // Clear inputs
                    classCountInput.value = '';
                    studentCountInput.value = '';
                }
            });

            function updateCreatedClassesList() {
                const selectedSemester = semesterSelect.value;
                if (!selectedSemester) return;

                const semesterClasses = sampleData.classSections.filter(cls => cls.semesterId === selectedSemester);
                
                createdClassesBody.innerHTML = semesterClasses.map(cls => {
                    const course = sampleData.courses.find(c => c.id === cls.courseId);
                    const classCoefficient = calculateClassCoefficient(cls.studentCount);
                    
                    return `
                        <tr>
                            <td class="px-6 py-4">${cls.code}</td>
                            <td class="px-6 py-4">${cls.name}</td>
                            <td class="px-6 py-4">${course ? course.name : ''}</td>
                            <td class="px-6 py-4">${cls.studentCount}</td>
                            <td class="px-6 py-4">${classCoefficient.toFixed(1)}</td>
                            <td class="px-6 py-4">
                                <button class="text-red-500 hover:text-red-700 delete-class-btn" data-id="${cls.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `;
                }).join('');

                // Add delete event listeners
                createdClassesBody.querySelectorAll('.delete-class-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        if (confirm('Bạn có chắc chắn muốn xóa lớp này?')) {
                            const classId = btn.dataset.id;
                            const index = sampleData.classSections.findIndex(c => c.id === classId);
                            if (index !== -1) {
                                sampleData.classSections.splice(index, 1);
                                updateCreatedClassesList();
                            }
                        }
                    });
                });
            }

            // Update created classes list when semester changes
            semesterSelect.addEventListener('change', updateCreatedClassesList);
        }
    }

    function deleteItem(section, id) {
        let dataKey;
        switch (section) {
            case 'Bằng cấp': dataKey = 'degrees'; break;
            case 'Khoa': dataKey = 'departments'; break;
            case 'Giáo viên': dataKey = 'teachers'; break;
            case 'Học phần': dataKey = 'courses'; break;
            case 'Kì học': dataKey = 'semesters'; break;
            case 'Lớp học phần': dataKey = 'classSections'; break;
            case 'Phân công giảng viên': dataKey = 'assignments'; break;
            default: dataKey = '';
        }
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
});