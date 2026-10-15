## v3.0.1 (??) 
TBD

## v3.0.0 (11/12/2024) 🦋🐛
🦋 [AREPL now restarts the python backend each run. This eliminates many bugs, although you may see more CPU utilization.](https://github.com/Almenon/AREPL-vscode/issues/439")
🐛 As a consequence of above, AREPL will no longer crash when there is a infinite loop
🐛 As a consequence of above, pandas now works better
🐛 As a consequence of above, boto3 now works better
🔧 `#$save` feature has been removed
🔧 Removed `keepPreviousVars` setting
🔧 `arepl_store` variable has been removed.

## v2.0.5 (3/5/2023) 🐛🚀
🐛 [Fixed inconsistent variable display in certain cases](https://github.com/Almenon/AREPL-vscode/issues/3716)

🚀 Basic types no longer appear as variables. This was done by updating the `arepl.defaultfiltertypes` setting.


## v2.0.4 (10/23/2022) 🐛🚀
🐛 [Fixed 'typing is not a package' error](https://github.com/Almenon/AREPL-vscode/issues/416)

🚀 [AREPL preview window now respects editor font size and weight](https://github.com/Almenon/AREPL-vscode/issues/257)

## v2.0.3 (07/25/2021) 🐛🐛🐛🔧
🐛 [Fixed python path from python extension no longer being picked up](https://github.com/Almenon/AREPL-vscode/issues/410)

🐛 [Fixed error message not showing when python path is incorrect](https://github.com/Almenon/AREPL-vscode/issues/389)

🐛 [Fixed bottom bar UI](https://github.com/Almenon/AREPL-vscode/issues/388)

🔧 [Added uninstall survey](https://github.com/Almenon/AREPL-vscode/issues/322)

## v2.0.2 (03/37/2021) 🐛
🐛 Fixed error with arepl on unix OS's

## v2.0.1 (11/22/2020) 🐛
🐛 Fixed https://github.com/Almenon/AREPL-vscode/issues/363

## v2.0.0 (11/15/2020)
????

## [v1.0.26](https://github.com/Almenon/AREPL-vscode/milestone/44?closed=1) (11/22/2020) 🐛🐛

🐛 Fixed error with AREPL.skipLandingPage setting

🐛 Fixed error when a exception was raised while using dump

## [v1.0.25](https://github.com/Almenon/AREPL-vscode/milestone/43?closed=1) (11/07/2020) 🔧🚀🐛

🔧 Python 3.7 or above is required for the below bugfix.

🐛 [Fixed error with Decimal library, among others](https://github.com/Almenon/AREPL-vscode/issues/347)

🚀 [Better icon thanks to @gllms](https://github.com/Almenon/AREPL-vscode/issues/115)


## [v1.0.24](https://github.com/Almenon/AREPL-vscode/milestone/42?closed=1) (05/23/2020) 🚀🐛🐛🐛🐛

🚀 [print results with many lines now come in much faster](https://github.com/Almenon/AREPL-vscode/pull/332)

🐛 Fixed arepl breaking when unicode was used [#149](https://github.com/Almenon/AREPL-vscode/issues/149) [#334](https://github.com/Almenon/AREPL-vscode/issues/334)

🐛 Fixed error when printing without a newline [#327](https://github.com/Almenon/AREPL-vscode/issues/327)

🐛 Fixed running indicator not appearing after reopening arepl [#334](https://github.com/Almenon/AREPL-vscode/issues/334)

🐛 Fixed rare bug where variables fail to show [#330](https://github.com/Almenon/AREPL-vscode/issues/330)


## [v1.0.23](https://github.com/Almenon/AREPL-vscode/milestone/41?closed=1) (04/04/2020) 🚀🐛

🚀 Improved how classes are dislayed in variable view [#320](https://github.com/Almenon/AREPL-vscode/issues/320)

🐛 Fix inline error icons showing up on the wrong line [#323](https://github.com/almenon/arepl-vscode/issues/323)

🐛 Fixed arepl.pythonPath setting so it correctly uses python interpreter set by python extension

## [v1.0.22](https://github.com/Almenon/AREPL-vscode/milestone/40?closed=1) (03/22/2020) 🚀🐛

🚀 Added keepPreviousVars setting. If set to true AREPL will add onto the local state each run instead of clearing it and starting fresh.

🚀 Added stdlib list for python 3.8

🐛 Renamed arepl files to start with arepl_ to avoid conflicting with user files. See [#314](https://github.com/almenon/arepl-vscode/issues/314)

🐛 Improved error handling for bad python path. See [#309](https://github.com/almenon/arepl-vscode/issues/309)

🐛 Fixed \_\_loader\_\_ - meta variable - it should now be the same as \_\_loader\_\_ when running python normally

## [v1.0.21](https://github.com/Almenon/AREPL-vscode/milestone/39?closed=1) (02/22/2020) 🚀🐛

🚀 Sped up backend when pickling primitives

🚀 defaultFilterVars setting added. You can use it to filter out vars of certain types from displaying in the variable view. You can also set a arepl_filter variable in arepl to play around with it in real-time. `arepl_filter=['foo']`

🚀 defaultFilterTypes setting added. You can use it to filter out vars of certain types from displaying in the variable view. You can also set a arepl_filter_type variable in arepl to play around with it in real-time. `arepl_filter_type=["<class 'str'>"]`

🚀 You can now define a arepl_filter_function variable you can use to totally customize the variables appearing in view

🐛 Fixed arepl_store var not working

🐛 [Fixed a TypeError with pandas thanks to David Aguilar](https://github.com/Almenon/AREPL-backend/issues/104)

🔧 Added showNameErrors and showSyntaxErrors settings you can use to not show those errors if they annoy you

🔧 Python 3.4 is no longer supported

## [v1.0.20](https://github.com/Almenon/AREPL-vscode/milestone/38?closed=1) (11/26/2019) 🚀

🚀 AREPL now automatically loads vars in your .env file. This feature is customizable in settings

🚀 Filename is now included in preview title so you know what file the preview is linked to

🚀 `arepl_filter` var added so you can filter out vars you don't want to see in preview

## [v1.0.19](https://github.com/Almenon/AREPL-vscode/milestone/37?closed=1) (10/13/2019) 🔧🐛

🔧 Changed filepath for temporary files to current workspace root

🔧 UI change: Variables section is now titled "Variables"

🐛 Fixed error message not appearing in certain cases

🐛 Fixed syntax error not appearing

## [v1.0.18](https://github.com/Almenon/AREPL-vscode/milestone/36?closed=1) (09/28/2019) 🔧🐛

🔧 Made print output font monospaced - now it should render output more evenly

🐛 Fixed error with infinite generators - thanks @purpledot!

🐛 Fixed python 2 error message not showing up on linux

## [v1.0.16](https://github.com/Almenon/AREPL-vscode/milestone/35?closed=1) (06/30/2019) 🐛

🐛 Fixed Conda env not working whatsoever. Conda will still not work with numpy but you can use it with other stuff now. 

## [v1.0.15](https://github.com/Almenon/AREPL-vscode/milestone/34?closed=1) (06/02/2019) 🚀🐛

🚀 Added icon to launch arepl. Click on the cat to open arepl on the current document. Click on the cat again to close. If you highlight a piece of code arepl will be opened on a new doc with that code.

🚀 Added customCSS setting for custom styling of arepl

🐛 Fixed arepl failing on linux

## [v1.0.14](https://github.com/Almenon/AREPL-vscode/milestone/33?closed=1) (04/18/2019) 🚀🐛

🚀 Added ability to run blocks of code

🚀 Added #$end comment for section where arepl will not auto-run on changes

🚀 Setting changes now take effect instantly (no need to reload arepl)

🐛 Fixed silent spawn error on mac

## [v1.0.13](https://github.com/Almenon/AREPL-vscode/milestone/32?closed=1) (03/23/2019) 🚀🐛

🚀 right click on editor title to launch arepl

🚀 Added cache var. See https://github.com/Almenon/AREPL-vscode/wiki/Caching-data-between-runs

🐛 Fixed vars dissapearing when there is syntax error

🐛 Fixed vars not clearing when using gui library

## [v1.0.12](https://github.com/Almenon/AREPL-vscode/milestone/30?closed=1) (03/17/2019) 🔧🐛

🚀 Reduce arepl bundle size

🔧 Changed turtle setting for much nicer turtle experience

🔧 Added more internal unit tests for less bugs in future releases

🐛 Fixed broken readme links

🐛 Fixed uppercase pip python modules reloading when they shouldnt be

## [v1.0.11](https://github.com/Almenon/AREPL-vscode/milestone/29?closed=1) (03/04/2019) 🐛

🚀 give friendly error message when bad python version

🐛 Fixed time taken flashes when using dump

🐛 Fixed 'C:\Program' is not recognized as an internal or external command, operable program or batch file

🐛 Fixed TypeError: Cannot read property 'setDecorations' of undefined

## [v1.0.10](https://github.com/Almenon/AREPL-vscode/milestone/28?closed=1) (02/19/2019) 🐛

🐛 Fixed stdout/vars persisting across arepl sessions

🐛 Fixed error in telemtry crashing arepl

## [v1.0.9](https://github.com/Almenon/AREPL-vscode/milestone/27?closed=1) (02/17/2019) 🐛

🐛 Variables that before crashed AREPL entirely now just show up as "AREPL could not pickle this object"

🐛 Fixed var output being retained inbetween sessions

🐛 Fixed FileNotFoundError (for real this time)

🚀 python path now supports the ${env:NAME} macro

## [v1.0.8](https://github.com/Almenon/AREPL-vscode/milestone/26?closed=1) (02/05/2019) 🐛

[🔧 Default pythonPath to be same as the python extension's python path](https://github.com/Almenon/AREPL-vscode/issues/170)

[🐛 Fixed FileNotFoundError](https://github.com/Almenon/AREPL-vscode/issues/162)

[🐛 Fixed pandas bug](https://github.com/Almenon/AREPL-vscode/issues/162)

[🐛 Fixed bug with reloading system modules unnecessarily](https://github.com/Almenon/AREPL-vscode/issues/162)

[🐛 Fixed bug with reloading pip modules unnecessarily](https://github.com/Almenon/AREPL-vscode/issues/162)

## [v1.0.7](https://github.com/Almenon/AREPL-vscode/milestone/25?closed=1) (01/22/2019) 🐛

[🔧 give better error when control-shift-a is invoked with nothing open](https://github.com/Almenon/AREPL-vscode/issues/159)

[🐛 Fixed python path for dump](https://github.com/Almenon/AREPL-vscode/issues/165)

[🚀 allow ${python.pythonPath} macro in pythonPath](https://github.com/Almenon/AREPL-vscode/issues/161)

## [v1.0.6](https://github.com/Almenon/AREPL-vscode/milestone/24?closed=1) (01/14/2019) 🔧
🔧 Changed message you get when python path is misconfigured

🐛 Fixed bug when closing editor with error decorations

## [v1.0.5](https://github.com/Almenon/AREPL-vscode/milestone/23?closed=1) (12/29/2018) 🔧🐛
🚀 input() support! Hardcode input like so: standard_input = "hello\\nworld" to be able to use input()

🔧 inline errors icons are now turned on by default - you can turn them off in settings

🔧 AREPL on windows now uses py (C:\\Windows\\py.exe) to launch python

🐛 Fixed bug where inline error icons stayed present when closing arepl

🐛 Fixed bug where items kept on being added to sys.path between runs

## [v1.0.4](https://github.com/Almenon/AREPL-vscode/milestone/22?closed=1) (12/15/2018) 🚀
🚀 pythonPath setting now supports paths relative to the workspace

🚀 Added optional inline error icons - this can be turned on by setting inlineResults setting to true

[howdoi](https://github.com/gleitz/howdoi) integration - install howdoi with pip to be able to call howdoi from arepl. For example
<code>howdoi('calculate fibbonaci in python')</code> will give you a function to calcualate a fibonaci number

## v1.0.3 🚀
🚀 ${workspaceFolder} can now be used in pythonPath for pointing to workspace-specific python interpreters

jsonPickle version upgrade w/ slightly better numpy and pandas support

🐛 Fixed bug with linux

## v1.0.2 🐛
🐛 Fixed error with using gui

## v1.0.1 🐛
🐛 Fixed error on mac due to a filename having the wrong case when packaging extension

## [v1.0.0](https://github.com/Almenon/AREPL-vscode/milestone/16?closed=1) 🐛

Fixed: 🐛 

🐛 [#86](https://github.com/almenon/arepl-vscode/issues/86) unittest causes arepl to fail silently bug

🐛 [#101](https://github.com/almenon/arepl-vscode/issues/101) styling becomes wierd when in certain scenarios bug 

🐛 [#102](https://github.com/almenon/arepl-vscode/issues/102)  internal error does not show bug

🐛 [#94](https://github.com/almenon/arepl-vscode/issues/94)  arepl frequently has problems rendering when there is a lot of prints bug

Updated: 🚀

[#56](https://github.com/almenon/arepl-vscode/issues/56)  use new webview enhancement

[#52](https://github.com/almenon/arepl-vscode/issues/52) Update vscode-extension-telemetry to the latest version

## [v1.5](https://github.com/Almenon/AREPL-vscode/milestone/15?closed=1)

🐛 fixed [#84](https://github.com/almenon/arepl-vscode/issues/84) [#87](https://github.com/almenon/arepl-vscode/issues/87) [#98](https://github.com/almenon/arepl-vscode/issues/98)

AREPL now works with python 3.7

🚀 AREPL now shows stderr (logs, for example) in print output

AREPL will no longer fail silently when help or input is called

## [v1.4](https://github.com/Almenon/AREPL-vscode/milestone/14?closed=1)

### Fixed: 🐛 
🐛 dump output does not appear if exception [#91](https://github.com/Almenon/AREPL-vscode/issues/91)

🐛 arepl does not update when user changes a imported file [#82](https://github.com/Almenon/AREPL-vscode/issues/82)

🐛 Functions no longer appear in variable preview (not much point in showing them and they clutter screen)

## [v1.3](https://github.com/Almenon/AREPL-vscode/milestone/13?closed=1)

### Fixed: 🐛 
arepl would not start if user had no python user packages installed  https://github.com/Almenon/AREPL-vscode/issues/81

### Added: 🚀
ability to execute on keybinding  https://github.com/Almenon/AREPL-vscode/issues/85

## [v1.2](https://github.com/Almenon/AREPL-vscode/milestone/12?closed=1)

### Added: 🚀
Ability to dump local variables and variables at specific points in your program - https://github.com/Almenon/AREPL-vscode/issues/74
Click on errors to google them - https://github.com/Almenon/AREPL-vscode/issues/76

## [v1.1](https://github.com/Almenon/AREPL-vscode/milestone/11?closed=1)

### Added: 🚀
GUI library setting - https://github.com/Almenon/AREPL-vscode/issues/68
default imports - https://github.com/Almenon/AREPL-vscode/issues/67

### Fixed: 🐛 
display of strings - see https://github.com/Almenon/AREPL-vscode/issues/71


## [v1.0](https://github.com/Almenon/AREPL-vscode/milestone/10?closed=1)

### Added: 🚀
Changelog in landing page (see [#58](https://github.com/Almenon/AREPL-vscode/issues/58))

Better landing page with examples (see [#32](https://github.com/Almenon/AREPL-vscode/issues/32))

Better display of variables (see [#63](https://github.com/Almenon/AREPL-vscode/issues/63))

### Fixed:
Relative imports not working (see [#69](https://github.com/Almenon/AREPL-vscode/issues/69))

---

## [v9](https://github.com/Almenon/AREPL-vscode/milestone/9?closed=1)

### Added: 🚀
Added telemetry (see [#50](https://github.com/Almenon/AREPL-vscode/issues/51)).
This is optional and can be turned off in the settings.

Having this turned on helps me analyze how many users I have, what settings are useful to them, and how frequently they use AREPL. It also reports internal errors with AREPL backend to help diagnose bugs.

### Fixed:
Exception stacktrace used to include internal AREPL stacktrace - now the stacktrace only shows info relative to your code (see [#51](https://github.com/Almenon/AREPL-vscode/issues/51))

---

## v8

Fixed too many prints slowing or freezing the preview.  See [#37](https://github.com/Almenon/AREPL-vscode/issues/37)

## v7

Fixing case issue causing error in linux systems

## v6

see https://github.com/Almenon/AREPL-vscode/milestone/6?closed=1

Fixed [#47](https://github.com/almenon/arepl-vscode/issues/47) new arepl session command fails when user does not have doc open

Implemented [#33](https://github.com/almenon/arepl-vscode/issues/33) footer bar with feedback links

## v5:

see https://github.com/Almenon/AREPL-vscode/milestone/5

### Added: 🚀
* Setting to skip landing page
* Setting for print results at top
* Command to execute highlighted code in AREPL
* command for creating new file
* allow user to customize pythonPath and pythonOptions
* allow user to execute on save

## Fixed:
* timing is not sticky
    
