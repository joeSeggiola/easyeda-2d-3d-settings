EasyEDA 2D/3D settings
======================

An [EasyEDA][1] [extension][2] that persists [2D/3D][3] view settings for individual PCBs.

Installation
------------

1. [Download the repository][4] and un-zip the archive on your drive.
2. Open [EasyEDA editor][5] and go to *Advanced → Extensions → Extensions Setting...*
3. Click the *Load Extension...* button and select the following files: `icon.svg`, `main.js`, `manifest.json`. 
4. Click *Load Extension* and close the *Extensions Setting* dialog.

Usage
-----

Open the 2D or 3D view of your PCB by using the EasyEDA toolbar buttons or the items under the View menu.
Change the view settings in the sidebar (colors, grid, surface finish, visible layers, etc) to your liking.
When you will open the same view again for the same PCB, the same settings will be automatically re-applied.

Every different PCB in your workspace will retain its own settings, new PCBs will start with the default values.

A couple technical notes: 

* Settings values are [persisted locally][6], not on your EasyEDA user account; that means they're not shared across devices, and they're lost if you clear your browser data.

* The extension listens for and stores value changes only in the last opened 2D/3D view; changes in other 2D/3D views (i.e. previosly opened and left there) won't be persisted.

Feedback
--------

If you find a bug or have a suggestion, please open an [issue][7] or send a [pull request][8].


[1]: https://easyeda.com/
[2]: https://docs.easyeda.com/en/API/1-How-to-Use-API/index.html
[3]: https://docs.easyeda.com/en/PCB/PCB-View/index.html
[4]: https://github.com/joeSeggiola/easyeda-2d-3d-settings/archive/refs/heads/main.zip
[5]: https://easyeda.com/editor
[6]: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
[7]: https://github.com/joeSeggiola/easyeda-2d-3d-settings/issues
[8]: https://github.com/joeSeggiola/easyeda-2d-3d-settings/pulls