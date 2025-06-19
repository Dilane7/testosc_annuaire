document.addEventListener('DOMContentLoaded', () => {

    // --- SÉLECTION DES ÉLÉMENTS DU DOM ---
    const employeeForm = document.getElementById('add-employee-form');
    const employeeList = document.getElementById('employee-list');

    // On charge les employés depuis le localStorage, ou on initialise un tableau vide
    let employees = JSON.parse(localStorage.getItem('employees')) || [];

    // --- FONCTIONS ---

    
    const renderEmployees = () => {
        employeeList.innerHTML = '';

        // Si aucun employé, on affiche un message
        if (employees.length === 0) {
            employeeList.innerHTML = '<li>Aucun employé dans l\'annuaire pour le moment.</li>';
            return;
        }

        // On parcourt le tableau d'employés et on crée un <li> pour chacun
        employees.forEach(employee => {
            const li = document.createElement('li');
            li.setAttribute('data-id', employee.id); // On ajoute l'ID comme data-attribute

            li.innerHTML = `
                <div class="employee-info">
                    <span class="name">${employee.nom} ${employee.prenom}</span>
                    <span class="email">${employee.email}</span>
                    <span class="poste">${employee.poste}</span>
                </div>
                <button class="btn-delete">Supprimer</button>
            `;

            employeeList.appendChild(li);
        });
    };

    /**
     * Sauvegarde la liste des employés dans le localStorage.
     */
    const saveEmployees = () => {
        localStorage.setItem('employees', JSON.stringify(employees));
    };

  
    const handleAddEmployee = (event) => {
        event.preventDefault(); 

        // Récupération des valeurs des champs et suppression des espaces inutiles
        const nom = document.getElementById('nom').value.trim();
        const prenom = document.getElementById('prenom').value.trim();
        const email = document.getElementById('email').value.trim();
        const poste = document.getElementById('poste').value.trim();

        //  tous les champs doivent être remplis
        if (!nom || !prenom || !email || !poste) {
            alert('Veuillez remplir tous les champs.');
            return;
        }
        
        // Validation du format de l'email avec une expression régulière
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Veuillez saisir une adresse email valide.');
            return;
        }

        // Création du nouvel objet employé avec un ID unique (basé sur le timestamp)
        const newEmployee = {
            id: Date.now(), // ID simple et unique
            nom,
            prenom,
            email,
            poste
        };

        // Ajout du nouvel employé au tableau
        employees.push(newEmployee);
        // Sauvegarde dans le localStorage
        saveEmployees();
        renderEmployees();
        employeeForm.reset();
    };

    /**
     * Gère la suppression d'un employé.
     */
    const handleDeleteEmployee = (event) => {
        if (event.target.classList.contains('btn-delete')) {
            const confirmed = confirm('Êtes-vous sûr de vouloir supprimer cet employé ?');
            if (!confirmed) {
                return; // L'utilisateur a annulé, on ne fait rien
            }
            const li = event.target.closest('li');
            const employeeId = Number(li.getAttribute('data-id'));

            employees = employees.filter(employee => employee.id !== employeeId);
            saveEmployees();
            renderEmployees();
        }
    };


    employeeForm.addEventListener('submit', handleAddEmployee);

    // C'est plus performant que d'ajouter un écouteur sur chaque bouton
    employeeList.addEventListener('click', handleDeleteEmployee);

    // Affiche les employés au chargement de la page
    renderEmployees();
});