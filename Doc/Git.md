

Deleting the .git folder may cause problems in your git repository. If you want to delete all your commit history but keep the code in its current state, it is very safe to do it as in the following:

    ###Checkout

    git checkout --orphan latest_branch

    ###Add all the files

    git add -A

    ###Commit the changes

    git commit -am "commit message"

    ###Delete the branch

    git branch -D main

    ###Rename the current branch to main

    git branch -m main

    ###Finally, force update your repository

    git push -f origin main

PS: this will not keep your old commit history around
