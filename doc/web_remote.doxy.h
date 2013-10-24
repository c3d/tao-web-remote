/**
 * @~english
 * @taomoduledescription{WebRemote, Web Remote Control}
 * <tt>import WebRemote</tt> - Control presentations from a web browser
 * (computer, tablet, smartphone).@n
 *
 * Example
 * @code
// Open this document and point your web browser/mobile phone/tablet
// to the URL printed on the console. Pressing the the space bar will
// also show the URL in the main Tao window.
import WebRemote
import Animate

page "Rectangle",
    color "blue"
    rectangle 0, 0, 200, 100
    // Message will show up on the presenter's device
    web_prompt "A <b>rectangle</b> has <b>4</b> right angles"
    next_page_after 10

page "Circle",
    color "red"
    circle 0, 0, 100
    web_prompt "A circle has no angle"
    next_page_after 8

page "Star",
    locally
        color "green"
        rotatez 5*page_time
        star 0, 0, 200, 200, 5, 0.4
    web_prompt ""
    next_page_after 8

next_page_after T:real ->
    locally
        [T-5 .. T]
            web_prompt "Next page in " & text (T - integer page_time) & " s."
        if page_time >= T then
            goto_page page_name ((page_number mod page_count) + 1)

web_remote_start

Msg -> ""
MsgTime -> 0.0
key "Space" ->
    Msg := "[" & WEB_REMOTE_LOCAL_URL & "]"
    writeln Msg
    MsgTime := time
locally
    time in [MsgTime .. MsgTime + 0.1, MsgTime + 4 .. MsgTime + 5]
        show smooth_ratio
        text_box 0, 0, 0.9*window_width, 0.9*window_height,
            vertical_align_bottom
            color "black"
            text Msg
 * @endcode
 *
 * @image html web_remote.png
 *
 * @endtaomoduledescription{WebRemote}
 *
 * @~french
 * @taomoduledescription{WebRemote, Télécommande Web}
 * <tt>import WebRemote</tt> - Télécommandez vos présentations depuis un
 * navigateur web (ordinateur, tablette, smartphone).@n
 *
 * Exemple
 *
 * @code
// Ouvrez ce document et connectez votre navigateur/téléphone/tablette
// à l'adresse indiquée sur la console. Ou tapez <Espace> pour afficher
// l'adresse dans la fenêtre principale.
import WebRemote
import Animate

page "Rectangle",
    color "blue"
    rectangle 0, 0, 200, 100
    // Ce message s'affichera sur les navigateurs/téléphones/tablettes
    // connectées
    web_prompt "Un <b>rectangle</b> possède <b>4</b> angles droits"
    page_suivante_après 10

page "Cercle",
    color "red"
    circle 0, 0, 100
    web_prompt "Un cercle n'a aucun côté"
    page_suivante_après 8

page "Étoile",
    locally
        color "green"
        rotatez 5*page_time
        star 0, 0, 200, 200, 5, 0.4
    web_prompt ""
    page_suivante_après 8

page_suivante_après T:real ->
    locally
        [T-5 .. T]
            web_prompt "Page suivante dans " & text (T - integer page_time) & " s."
        if page_time >= T then
            goto_page page_name ((page_number mod page_count) + 1)

web_remote_start

Msg -> ""
MsgTime -> 0.0
key "Space" ->
    Msg := "[" & WEB_REMOTE_LOCAL_URL & "]"
    writeln Msg
    MsgTime := time
locally
    time in [MsgTime .. MsgTime + 0.1, MsgTime + 4 .. MsgTime + 5]
        show smooth_ratio
        text_box 0, 0, 0.9*window_width, 0.9*window_height,
            vertical_align_bottom
            color "black"
            text Msg
 * @endcode
 *
 * @image html web_remote_fr.png
 *
 * @endtaomoduledescription{WebRemote}
 *
 * @~
 * @{
 */

/**
 * @~english
 * Start a web server and create thumbnails for all pages in the
 * presentation.
 * The URL of the web server is printed on the console, and is also made
 * available in the WEB_REMOTE_LOCAL_URL variable.
 * @~french
 * Démarre un serveur web et créé des miniatures pour chaque page de la
 * présentation.
 * L'addresse (URL) du serveur est affichée sur la console, et est également
 * disponible dans la variable WEB_REMOTE_LOCAL_URL.
 */
web_remote_start();


/**
 * @~english
 * Show a message on the presenter's device.
 * @p T may be plain text or HTML. The message is shown on all browsers
 * that are connected to the server. It appears near the thumbnail
 * representing the current page, under the page name.
 * When called several times, the function sends a message only if it is
 * different from the previous one. Therefore it is not a problem to call
 * @c web_prompt in a block that is refreshed periodically.
 * @~french
 * Affiche un message à destination du présentateur.
 * @p T est un texte simple ou bien du HTML. Le message s'affiche sur tous les
 * navigateurs connectés au serveur, près de l'icône représentant la page
 * en cours, sous le nom de la page.
 * Lorqu'elle est appelée plusieurs fois de suite, la fonction n'envoit un
 * message que s'il est différent du précédent, de sorte qu'il est possible
 * d'utiliser @c web_prompt sans précaution particulière dans un bloc
 * rafraîchit périodiquement.
 * @~
 * @since 1.02
 */
web_prompt(T:text);

/**
 * @}
 */
