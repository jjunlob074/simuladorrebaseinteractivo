document.addEventListener('DOMContentLoaded', function () {
    let commits = [
        { id: 'a1b2c3d', message: 'Añadir función nueva' },
        { id: 'd4e5f6g', message: 'Optimización del código de la función nueva' },
        { id: 'b2c3d4e', message: 'Corregir typo en la documentación' },
        { id: 'c3d4e5f', message: 'Actualizar README' },
        { id: 'e5f6g7h', message: 'Refactorizar los tests unitarios' },
        { id: 'f7g8h9i', message: 'Añadir comentarios a las funciones complicadas' }
    ];

    const commitList = document.getElementById('commitList');
    let selectedCommitIndex = null;

    function updateCommitList() {
        commitList.innerHTML = '';
        commits.forEach((commit, index) => {
            const li = createCommitListItem(commit, index);
            commitList.appendChild(li);
        });
    }

    function createCommitListItem(commit, index) {
        const li = document.createElement('li');
        li.innerHTML = `<b style="color:#5c87b2;">pick</b> ${commit.id} - ${commit.message}`;
        li.className = selectedCommitIndex === index ? 'commit-item selected' : 'commit-item';
        li.onclick = () => toggleSelectCommit(index);
        addActionButtons(commit, index, li);
        return li;
    }

    function addActionButtons(commit, index, li) {
        ['Reword', 'Edit', 'Drop'].forEach(action => {
            addActionButton(action, () => handleAction(action, commit, index), li);
        });
        if (index > 0) {  // Only add squash and fixup if not the first commit
            addActionButton('Squash', () => handleAction('Squash', commit, index), li);
            addActionButton('Fixup', () => handleAction('Fixup', commit, index), li);
        }
    }

    function addActionButton(text, action, parent) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'button';
        button.onclick = function(event) {
            action();
            event.stopPropagation(); // Prevent triggering li click event
        };
        parent.appendChild(button);
    }

    function handleAction(action, commit, index) {
        switch (action) {
            case 'Reword':
                const newMessage = prompt("Enter new commit message:", commit.message);
                if (newMessage) {
                    commit.message = newMessage;
                    updateCommitList();
                }
                break;
            case 'Edit':
                alert('Stopping for edit at commit ' + commit.id);
                break;
                case 'Squash':
                    commits[index - 1].message += " & " + commits[index].message;
                    commits[index - 1].id = generateNewHash(); // Generate a new hash for the combined commit
                    commits.splice(index, 1);
                    updateCommitList();
                    break;
                case 'Fixup':
                    alert('Fixup will combine this commit with the previous one but will keep only the message from the previous commit, discarding the message from this commit.');
                    commits[index - 1].id = generateNewHash(); // Generate a new hash for the combined commit
                    commits.splice(index, 1);
                    updateCommitList();
                    break;
            case 'Drop':
                commits.splice(index, 1);
                updateCommitList();
                break;
        }
    }

    function generateNewHash() {
        return Math.random().toString(36).substring(2, 9);
    }

    function toggleSelectCommit(index) {
        if (selectedCommitIndex === index) {
            selectedCommitIndex = null;  // Unpick if already picked
        } else if (selectedCommitIndex !== null) {
            [commits[selectedCommitIndex], commits[index]] = [commits[index], commits[selectedCommitIndex]];
            selectedCommitIndex = null;
        } else {
            selectedCommitIndex = index; // Pick the commit
        }
        updateCommitList();
    }

    updateCommitList();
    document.getElementById('RebaseButton').addEventListener('click', () => startRebase(commits));
});

function startRebase(commits) {
    if (commits.length > 0) {
        alert('commit order:\n' + commits.map(commit => `${commit.id} - ${commit.message}`).join('\n'));
    } else {
        alert('No commits to rebase.');
    }
}
