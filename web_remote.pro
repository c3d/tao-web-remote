
MODINSTDIR = web_remote

include(../modules.pri)

OTHER_FILES = web_remote.xl
OTHER_FILES += doc/web_remote.doxy.h doc/Doxyfile.in

# Icon from: http://www.iconspedia.com/icon/iphone-12112.html
# Author: Archigraphs, http://www.archigraphs.com/
# License: Free
INSTALLS    += thismod_icon
INSTALLS    -= thismod_bin


QMAKE_SUBSTITUTES = doc/Doxyfile.in
QMAKE_DISTCLEAN = doc/Doxyfile
DOXYFILE = doc/Doxyfile
DOXYLANG = en,fr
include(../modules_doc.pri)

# node_modules: the NodeJS modules directory
# Created by 'npm install'; platform-specific binaries are not committed
# into the git repository:
#  npm install express socket.io
#  find . -name build | xargs rm -rf
# Binaries are re-created for each platform by 'npm rebuild'.
PRE_TARGETDEPS = node_modules
node_modules.target = node_modules
node_modules.commands = npm install express@3.1.0 socket.io@0.9.13
QMAKE_EXTRA_TARGETS += node_modules
distclean_rm_node_modules.commands = rm -rf ./node_modules
distclean.depends = distclean_rm_node_modules
QMAKE_EXTRA_TARGETS += distclean distclean_rm_node_modules

# Install NodeJS modules
install_node_modules.files = ./node_modules
install_node_modules.path  = $${MODINSTPATH}
QMAKE_EXTRA_TARGETS += install_node_modules
INSTALLS += install_node_modules

install_extra.files = web_remote.js web_remote.html
install_extra.path = $${MODINSTPATH}
QMAKE_EXTRA_TARGETS += install_extra
INSTALLS += install_extra

