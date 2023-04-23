import Head from "next/head"
import { useState, useEffect } from "react"

const CONSTS = { BACKEND_URL: "http://localhost/admin" }

export default function Admin() {
    // for all pages
    const [pageName, setPageName] = useState(null)

    // for left and middle panel
    const [pages, setPages] = useState([])
    const [sections, setSections] = useState([])

    // for login form
    const [securityData, setSecurityData] = useState({ login: "", password: "", error: "" });

    // for page sideBar
    const [pageContent, setPageContent] = useState({ pageName: "", pageNameEn: "" })

    // for section sideBar
    const [sectionContent, setSectionContent] = useState({ sectionName: "", sectionNameEn: "", type: "array", inputs: [{ title: "", titleEn: "", type: "text" }] })

    // for queries and left and middle panel
    const [currentPage, setCurrentPage] = useState(null)
    const [currentSection, setCurrentSection] = useState(null)

    // for header title
    const [activeHeader, setActiveHeader] = useState(null)

    // modal window in right top part of screen
    const [modal, setModal] = useState({ isShow: false })

    // start useEffect
    useEffect(() => {
        if (isLogin()) {
            setLastTimeInPanelInLocalStorage()
            setPageInLocalStorage(getPageFromLocalStorage())
            setPageName(getPageFromLocalStorage())
            refreshPagesList(setPages)
            refreshSectionsList(setSections)
            setCurrentPage(getCurrentPageFromLocalStorage())
            setCurrentSection(getCurrentSectionFromLocalStorage())
        }
        else {
            deleteAllFromInLocalStorage()
            setPageName(getPageFromLocalStorage())
        }
    }, [])

    // for setActiveHeader
    useEffect(() => {
        if (currentSection && sections.length) sections.forEach(section => section.section_name_en === currentSection && setActiveHeader(section.section_name))
        else if (currentPage && pages.length) pages.forEach(page => page.page_name_en === currentPage && setActiveHeader(page.page_name))
    }, [pages, sections, currentPage, currentSection])

    // for getting current section
    useEffect(() => {
        if (pageName === "section_panel") getSection(setSectionContent, setModal)
        if (pageName === "edit_section") getSection(setSectionContent, setModal)
        if (pageName === "edit_page") getPage(setPageContent, setModal)
    }, [pageName, currentPage, currentSection])

    useEffect(() => {
        if (modal.isShow) setTimeout(() => setModal({ isShow: false }), 3000);
    }, [modal.isShow])

    const Modal = () => {
        return (
            <>
                {modal.isShow &&
                    <div className="modal">
                        {modal.status ? <div className="modal_success">&#10003;</div> : <div className="modal_error">&#215;</div>}
                        {modal.text}
                    </div>
                }
            </>
        )
    }

    const SidebarPages = () => {
        return (
            <div className="admin_panel_left">

                <Modal />

                <div className="admin_logout_btn" onClick={() => {
                    deleteAllFromInLocalStorage()
                    setPageName(getPageFromLocalStorage())
                    setSecurityData({ login: "", password: "", error: "" })
                }}>
                    Выйти
                </div>

                <button className={currentPage === "+" ? "admin_panel_left_add admin_panel_left_section_active" : "admin_panel_left_add"} onClick={() => {
                    setPageContent({ pageName: "", pageNameEn: "" })
                    setPageInLocalStorage("add_page")
                    setPageName("add_page")
                    setCurrentPage("+")
                    setCurrentPageInLocalStorage("+")
                }}>+</button>

                {pages.map((page) =>
                    <button key={page.id} className={page.page_name_en === currentPage ? "admin_panel_left_section admin_panel_left_section_active" : "admin_panel_left_section"} onClick={async () => {
                        setPageInLocalStorage("page_panel")
                        setPageName("page_panel")
                        setCurrentPage(page.page_name_en)
                        setCurrentPageInLocalStorage(page.page_name_en)
                        setCurrentSection(null)
                        deleteCurrentSectionInLocalStorage()
                        await refreshSectionsList(setSections)
                    }}
                        onDoubleClick={async () => {
                            setPageInLocalStorage("edit_page")
                            setPageName("edit_page")
                        }}
                    >
                        {page.page_name}
                    </button>
                )}
            </div>
        )
    }

    const SidebarContents = () => {
        return (
            <div className="admin_panel_middle">
                <button className={currentSection === "+" ? "admin_panel_left_add admin_panel_left_section_active" : "admin_panel_left_add"} onClick={() => {
                    setSectionContent({ sectionName: "", sectionNameEn: "", type: "array", inputs: [{ title: "", titleEn: "", type: "text" }] })
                    setPageInLocalStorage("add_section")
                    setPageName("add_section")
                    setCurrentSection("+")
                    setCurrentSectionInLocalStorage("+")
                }}>+</button>

                {
                    sections.map((section) =>
                        <button key={section.id} className={section.section_name_en === currentSection ? "admin_panel_left_section admin_panel_left_section_active" : "admin_panel_left_section"} onClick={async () => {
                            setPageInLocalStorage("section_panel")
                            setPageName("section_panel")
                            setCurrentSection(section.section_name_en)
                            setCurrentSectionInLocalStorage(section.section_name_en)
                        }}
                            onDoubleClick={async () => {
                                setPageInLocalStorage("edit_section")
                                setPageName("edit_section")
                            }}
                        >
                            {section.section_name}
                        </button>
                    )
                }
            </div >
        )
    }

    const HeadInfo = () => {
        return (
            <>
                <Head>
                    <title>Админка</title>
                </Head>
                <style global jsx>{`
/* $DARK_BG: #2F3136;
$LIGHT_COLOR: #f0f2f3;
$DARK_ELEMS_BG: #36393E;
$BORDER_COLOR: #697278;
$INPUT_BG: #697278;
$BUTTON_BG: #697278;
$ERROR_COLOR: red;
$PANEL_BG: #585d61; */

/* GLOBAL */
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
    margin: 0;
    padding: 0;
    border: 0;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
}

article,
aside,
details,
figcaption,
figure,
footer,
header,
hgroup,
menu,
nav,
section {
    display: block;
}

body {
    line-height: 1;
}

ol,
ul {
    list-style: none;
}

blockquote,
q {
    quotes: none;
}

blockquote:before,
blockquote:after,
q:before,
q:after {
    content: '';
    content: none;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}

html {
    box-sizing: border-box;
}

*,
*::before,
*::after {
    box-sizing: inherit;
    font-family: 'Verdana', sans-serif;
}

button {
    background-color: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
}

body {
    background-color: #2F3136;
    color: #f0f2f3;
    border-color: #697278;
}

input::placeholder,
textarea::placeholder {
    opacity: .5;
    color: #2F3136;
}


input[type='file'] {
    color: transparent;
}

.select,
.option {
    font-size: 16px;
    color: #f0f2f3;
    background-color: #697278;
    border-radius: 4px;
    padding: 10px;
    height: 40px;
    color: #fff;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.4);
    border: none;
    outline: none;
}

/* LOCAL */

.btn {
    margin-top: 15px;
    background-color: #697278;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 18px;
    color: #f0f2f3;
    border: 1px solid #697278;
    transition: 0.3s;
}

.btn:hover {
    transition: 0.3s;
    border-color: #999;
}

.btn_small {
    padding: 6px 10px;
    font-size: 12px;
}

.btn_header {
    margin-top: 0;
}

.btns_group {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.input {
    border: none;
    outline: none;
    border-radius: 4px;
    font-size: 16px;
    color: #f0f2f3;
    background-color: #697278;
    height: 40px;
    padding: 10px;
}

.input_small {
    font-size: 14px;
    padding: 6px;
    width: 240px;
    height: 30px;
    border-radius: 10px;
}

.textarea_small {
    color: #f0f2f3;
    background-color: #697278;
    font-size: 14px;
    padding: 6px;
    width: 400px;
    height: 60px;
    border-radius: 10px;
    border: none;
    outline: none;
}

.input_header {
    width: 100%;
    margin-right: 20px;
}

.input_file::-webkit-file-upload-button {
    visibility: hidden;
    display: none;
}

.input_file:before {
    content: 'Выберите картинку';
    display: inline-block;
    padding: 5px 8px;
    outline: none;
    border-radius: 10px;
    font-size: 18px;
    color: #f0f2f3;
    cursor: pointer;
    font-size: 10pt;
    background-color: #697278;
    border: 1px solid #697278;
    transition: 0.3s;
    height: 30px;
}

.input_file:hover::before {
    transition: 0.3s;
    border-color: #999;
}

.select_header {
    margin-right: 20px;
}

.modal {
    position: fixed;
    bottom: 10px;
    right: 10px;
    z-index: 2000;
    display: flex;
    align-items: center;
    gap: 10px;
    background: #697278;
    padding: 20px;
    border-radius: 50px;
}

.modal_success,
.modal_error {
    height: 20px;
    width: 20px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal_success {
    background: green;
}

.modal_error {
    background: red;
}

.admin {
    font-family: 'Verdana', sans-serif;
    background-color: #f0f2f3;
    color: #f0f2f3;
    border-color: #697278;
}

.admin_start_page {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #585d61;
}

.admin_start_page_form {
    min-width: 320px;
    height: 360px;
    background: #36393E;
    border-radius: 16px;
    border: 1px solid #697278;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px 16px;
}

.admin_start_page_form_title {
    font-size: 24px;
}

.admin_start_page_form_input {
    width: 100%;
    margin-top: 20px;
}

.admin_start_page_form_error {
    margin-top: 5px;
    color: red;
    height: 10px;
}

.admin_panel_left {
    height: calc(100vh - 80px);
    width: 80px;
    overflow: auto;
    background-color: #2F3136;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 100;
}

.admin_panel_left_add {
    width: 80px;
    height: 80px;
    background-color: #697278;
    cursor: pointer;
    color: #2F3136;
    font-size: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 2px solid white;
}

.admin_panel_left_section {
    width: 80px;
    height: 80px;
    background-color: #697278;
    cursor: pointer;
    color: #2F3136;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 2px solid rgb(255, 255, 255);
}

.admin_panel_right {
    width: 100%;
    height: calc(100vh - 80px);
    background-color: #585d61;
    position: fixed;
    left: 80px;
    top: 80px;
}

.admin_panel_right_right {
    left: 160px;
}

.admin_panel_right_top {
    position: fixed;
    top: 0;
    left: 80px;
    width: 100%;
    height: 80px;
    background-color: #2F3136;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    padding-right: 100px;
}

.admin_panel_right_right_top {
    left: 160px;
    padding-right: 180px;
}

.admin_panel_right_add {
    padding: 0 20px;
    width: 100%;
    height: 100%;
    overflow: scroll;
}

.admin_panel_right_add_form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    /* border: 1px solid black; */
    padding: 20px;
}

.admin_panel_right_add_form_input {
    width: 300px;
    margin-bottom: 20px;
}

.admin_panel_right_add_form_select,
.admin_panel_right_add_form_option {
    width: 300px;
}

.admin_panel_right_add_form_btns {
    display: flex;
    gap: 10px
}

.admin_panel_middle {
    height: 100vh;
    overflow: auto;
    width: 80px;
    background-color: #2F3136;
    position: fixed;
    left: 80px;
    top: 0;
    z-index: 100;
}

.admin_panel_left_section_active {
    background-color: rgb(255, 255, 255);
    color: #2F3136;
}

.admin_panel_right_top_title {
    margin-left: 10px;
    color: #f0f2f3;
    font-size: 36px;
}

.admin_panel_right_add_img {
    max-width: 400px;
    min-width: 200px;
    border: 3px dashed #697278;
}

.admin_panel_right_add_inputs {
    margin-top: 5px;
    max-width: 535px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.admin_panel_right_add_title {
    font-size: 20px;
    margin: 15px 0 5px;
}

.admin_panel_right_add_block {
    margin: 50px 160px 10px 0;
    border-top: 2px solid #697278;
}

.admin_logout_btn {
    height: 80px;
    width: 80px;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid rgb(255, 255, 255);
    background: #697278;
    cursor: pointer;
}

.admin_logout_btn .btn {
    margin-top: 0;
}
`}</style>

            </>
        )
    }

    if (pageName === "login") {
        return (
            <><HeadInfo />
                <div className="admin">
                    <div className="admin_start_page">
                        <div className="admin_start_page_form">
                            <div className="admin_start_page_form_title">Введите логин и пароль</div>
                            <input
                                type="text"
                                placeholder="Логин"
                                className="admin_start_page_form_input input"
                                value={securityData.login}
                                onChange={(e) => setSecurityData({ ...securityData, login: e.target.value })}
                            />
                            <input
                                type="password"
                                placeholder="Пароль"
                                className="admin_start_page_form_input input"
                                value={securityData.password}
                                onChange={(e) => setSecurityData({ ...securityData, password: e.target.value })}
                            />

                            <div className="admin_start_page_form_error">{securityData.error ? securityData.error : null}</div>
                            <button className="btn" onClick={async () => await login(securityData, setSecurityData, setPageName, setCurrentPage, setPageContent, setPages, setSections)}>Войти</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (pageName === "add_page") {
        return (
            <><HeadInfo />
                <div className="admin">
                    <div className="admin_panel">
                        <SidebarPages />
                        <div className="admin_panel_right">
                            <div className="admin_panel_right_top">
                                <input
                                    type="text"
                                    placeholder="Название страницы"
                                    className="input input_header"
                                    value={pageContent.pageName}
                                    onChange={(e => setPageContent({ ...pageContent, pageName: e.target.value }))}
                                />
                                <input
                                    type="text"
                                    placeholder="Page's name"
                                    className="input input_header"
                                    value={pageContent.pageNameEn}
                                    onChange={(e) => setPageContent({ ...pageContent, pageNameEn: e.target.value })}
                                />
                                <button className="btn btn_header" onClick={async () => {
                                    await createPage(pageContent, setModal)
                                    await refreshPagesList(setPages)
                                    setPageContent({ pageName: "", pageNameEn: "" })
                                }}>Создать</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (pageName === "edit_page") {
        return (
            <><HeadInfo />
                <div className="admin">
                    <div className="admin_panel">
                        <SidebarPages />
                        <div className="admin_panel_right">
                            <div className="admin_panel_right_top"> {/* SidebarTop */}
                                <input
                                    type="text"
                                    placeholder="Название страницы"
                                    className="input input_header"
                                    value={pageContent.pageName}
                                    onChange={(e => setPageContent({ ...pageContent, pageName: e.target.value }))}
                                />
                                <input
                                    type="text"
                                    placeholder="Page's name"
                                    className="input input_header"
                                    value={pageContent.pageNameEn}
                                    onChange={(e) => setPageContent({ ...pageContent, pageNameEn: e.target.value })}
                                />
                                <button className="btn btn_header" onClick={async () => {
                                    await updatePage(pageContent, setModal)
                                    await refreshPagesList(setPages)
                                }}>Изменить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (pageName === "page_panel") {
        return (
            <><HeadInfo />
                <div className="admin">
                    <div className="admin_panel">
                        <SidebarPages />
                        <SidebarContents />
                        <div className="admin_panel_right admin_panel_right_right">
                            <div className="admin_panel_right_top admin_panel_right_right_top">
                                <div className="admin_panel_right_top_title">
                                    {activeHeader}
                                </div>
                                <button className="btn btn_header" onClick={async () => {
                                    await deletePage(setModal)
                                    await refreshPagesList(setPages)
                                    setPageContent({ pageName: "", pageNameEn: "" })
                                    setPageInLocalStorage("add_page")
                                    setPageName("add_page")
                                    setCurrentPage("+")
                                    setCurrentPageInLocalStorage("+")
                                }}>Удалить страницу</button>
                            </div>
                        </div>
                    </div>
                </div >
            </>
        )
    }

    if (pageName === "add_section") {
        return (
            <><HeadInfo />
                <div className="admin">
                    <div className="admin_panel">
                        <SidebarPages />
                        <SidebarContents />
                        <div className="admin_panel_right admin_panel_right_right">
                            <div className="admin_panel_right_top admin_panel_right_right_top"> {/* SidebarTop */}
                                <input
                                    type="text"
                                    placeholder="Название раздела"
                                    className="input input_header"
                                    value={sectionContent.sectionName}
                                    onChange={(e => setSectionContent({ ...sectionContent, sectionName: e.target.value }))}
                                />
                                <input
                                    type="text"
                                    placeholder="Section's name"
                                    className="input input_header"
                                    value={sectionContent.sectionNameEn}
                                    onChange={(e) => setSectionContent({ ...sectionContent, sectionNameEn: e.target.value })}
                                />

                                <select
                                    className="select select_header"
                                    value={sectionContent.type}
                                    onChange={(e) => setSectionContent({ ...sectionContent, type: e.target.value })}
                                >
                                    {["array", "object"].map((value, i) =>
                                        <option key={i} value={value} className="option">
                                            {value}
                                        </option>)}
                                </select>

                                <button className="btn btn_header" onClick={async () => {
                                    await createSection(sectionContent, setModal)
                                    await refreshSectionsList(setSections)
                                    setSectionContent({ sectionName: "", sectionNameEn: "", type: "array", inputs: [{ title: "", titleEn: "", type: "text" }], })
                                }}>Создать</button>
                            </div>

                            <div className="admin_panel_right_add">
                                {sectionContent.inputs.map((section, i) => <div key={i} className="admin_panel_right_add_form">
                                    <input
                                        type="text"
                                        placeholder="Подраздел"
                                        className="admin_panel_right_add_form_input input"
                                        value={section.title}
                                        onChange={(e => {
                                            const copyArr = { ...sectionContent }
                                            copyArr.inputs[i] = { ...sectionContent.inputs[i], title: e.target.value }
                                            setSectionContent(copyArr)
                                        })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Подраздел in ENG"
                                        className="admin_panel_right_add_form_input input"
                                        value={section.titleEn}
                                        onChange={(e => {
                                            const copyArr = { ...sectionContent }
                                            copyArr.inputs[i] = { ...sectionContent.inputs[i], titleEn: e.target.value }
                                            setSectionContent(copyArr)
                                        })}
                                    />
                                    <select
                                        className="admin_panel_right_add_form_select select"
                                        value={sectionContent.inputs[i].type}
                                        onChange={(e => {
                                            const copyArr = { ...sectionContent }
                                            copyArr.inputs[i] = { ...sectionContent.inputs[i], type: e.target.value }
                                            setSectionContent(copyArr)
                                        })}
                                    >
                                        {["text", "number", "img"].map((value, i) =>
                                            <option key={i} value={value} className="admin_panel_right_add_form_option option">
                                                {value}
                                            </option>)}
                                    </select>
                                    <div className="admin_panel_right_add_form_btns">
                                        <button
                                            className="btn btn_small"
                                            onClick={() => {
                                                const copyArr = { ...sectionContent }
                                                copyArr.inputs.pop()
                                                setSectionContent(copyArr)
                                            }}
                                        >
                                            Удалить этот
                                        </button>
                                        {sectionContent.inputs.length === i + 1 ?
                                            <button
                                                className="btn btn_small"
                                                onClick={() => {
                                                    const copyArr = { ...sectionContent }
                                                    sectionContent.inputs[i + 1] = { title: "", titleEn: "", type: "text" }
                                                    setSectionContent(copyArr)
                                                }}
                                            >
                                                Добавить ещё
                                            </button>
                                            : null}

                                    </div>
                                </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    if (pageName === "edit_section") {
        return (
            <><HeadInfo />
                <div className="admin">
                    <div className="admin_panel">
                        <SidebarPages />
                        <SidebarContents />
                        <div className="admin_panel_right admin_panel_right_right">
                            <div className="admin_panel_right_top admin_panel_right_right_top"> {/* SidebarTop */}
                                <input
                                    type="text"
                                    placeholder="Название раздела"
                                    className="input input_header"
                                    value={sectionContent.sectionName}
                                    onChange={(e => setSectionContent({ ...sectionContent, sectionName: e.target.value }))}
                                />
                                <input
                                    type="text"
                                    placeholder="Section's name"
                                    className="input input_header"
                                    value={sectionContent.sectionNameEn}
                                    onChange={(e) => setSectionContent({ ...sectionContent, sectionNameEn: e.target.value })}
                                />
                                <button className="btn btn_header" onClick={async () => {
                                    await updateSection(sectionContent, setModal)
                                    await refreshSectionsList(setSections)
                                }}>Изменить</button>
                            </div>

                            <div className="admin_panel_right_add">
                                {sectionContent.inputs.map((section, i) => <div key={i} className="admin_panel_right_add_form">
                                    <input
                                        type="text"
                                        placeholder="Подраздел"
                                        className="admin_panel_right_add_form_input input"
                                        value={section.title}
                                        onChange={(e => {
                                            const copyArr = { ...sectionContent }
                                            copyArr.inputs[i] = { ...sectionContent.inputs[i], title: e.target.value }
                                            setSectionContent(copyArr)
                                        })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Подраздел in ENG"
                                        className="admin_panel_right_add_form_input input"
                                        value={section.titleEn}
                                        onChange={(e => {
                                            const copyArr = { ...sectionContent }
                                            copyArr.inputs[i] = { ...sectionContent.inputs[i], titleEn: e.target.value }
                                            setSectionContent(copyArr)
                                        })}
                                    />
                                    <select
                                        className="admin_panel_right_add_form_select select"
                                        value={sectionContent.inputs[i].type}
                                        onChange={(e => {
                                            const copyArr = { ...sectionContent }
                                            copyArr.inputs[i] = { ...sectionContent.inputs[i], type: e.target.value }
                                            setSectionContent(copyArr)
                                        })}
                                    >
                                        {["text", "number", "img"].map((value, i) =>
                                            <option key={i} value={value} className="admin_panel_right_add_form_option option">
                                                {value}
                                            </option>)}
                                    </select>
                                    <div className="admin_panel_right_add_form_btns">
                                        <button
                                            className="btn btn_small"
                                            onClick={() => {
                                                const copyArr = { ...sectionContent }
                                                copyArr.inputs.pop()
                                                setSectionContent(copyArr)
                                            }}
                                        >
                                            Удалить этот
                                        </button>
                                        {sectionContent.inputs.length === i + 1 ?
                                            <button
                                                className="btn btn_small"
                                                onClick={() => {
                                                    const copyArr = { ...sectionContent }
                                                    sectionContent.inputs[i + 1] = { title: "", titleEn: "", type: "text" }
                                                    setSectionContent(copyArr)
                                                }}
                                            >
                                                Добавить ещё
                                            </button>
                                            : null}

                                    </div>
                                </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div >
            </>
        )
    }

    if (pageName === "section_panel") {
        return (
            <><HeadInfo />
                <div className="admin">
                    <div className="admin_panel">
                        <SidebarPages />
                        <SidebarContents />
                        <div className="admin_panel_right admin_panel_right_right">
                            <div className="admin_panel_right_top admin_panel_right_right_top">
                                <div className="admin_panel_right_top_title">
                                    {activeHeader}
                                </div>

                                <button className="btn btn_header" onClick={async () => {
                                    await deleteSection(setModal)
                                    await refreshSectionsList(setSections)
                                    setSectionContent({ sectionName: "", sectionNameEn: "", type: "array", inputs: [{ title: "", titleEn: "", type: "text" }] })
                                    setPageInLocalStorage("add_section")
                                    setPageName("add_section")
                                    setCurrentSection("+")
                                    setCurrentSectionInLocalStorage("+")
                                }}>Удалить секцию</button>

                            </div>

                            {sectionContent.sectionName &&
                                <div className="admin_panel_right_add">
                                    {sectionContent.type === "object" && sectionContent.data && sectionContent.inputs.map((input, i) => {

                                        if (input.type === "text" || input.type === "number") {
                                            return (
                                                <div key={i}>
                                                    <div className="admin_panel_right_add_title">{input.title}:</div>
                                                    {input.type === "text"
                                                        ?
                                                        <textarea
                                                            className="textarea_small"
                                                            type="text"
                                                            placeholder="текст"
                                                            value={sectionContent.data[input.titleEn]}
                                                            onChange={(e => {
                                                                const copy = { ...sectionContent }
                                                                copy.data[input.titleEn] = e.target.value
                                                                setSectionContent(copy)
                                                            })}
                                                        />
                                                        :
                                                        <input
                                                            className="input input_small"
                                                            type="number"
                                                            placeholder="число"
                                                            value={sectionContent.data[input.titleEn]}
                                                            onChange={(e => {
                                                                const copy = { ...sectionContent }
                                                                copy.data[input.titleEn] = e.target.value
                                                                setSectionContent(copy)
                                                            })} />
                                                    }
                                                </div>)
                                        }

                                        if (input.type === "img") {
                                            return (<div key={i}>
                                                <div className="admin_panel_right_add_title">{input.title}:</div>
                                                {sectionContent.data[input.titleEn].src &&
                                                    <img
                                                        className="admin_panel_right_add_img"
                                                        src={`${CONSTS.BACKEND_URL}/${sectionContent.data[input.titleEn].src}`}
                                                    />
                                                }
                                                <div className="admin_panel_right_add_inputs">
                                                    <input
                                                        className="input input_small"
                                                        type="text"
                                                        placeholder="alt"
                                                        value={sectionContent.data[input.titleEn].alt}
                                                        onChange={(e => {
                                                            const copy = { ...sectionContent }
                                                            copy.data[input.titleEn].alt = e.target.value
                                                            setSectionContent(copy)
                                                        })} />
                                                    <input
                                                        className="input_file"
                                                        type='file'
                                                        name='file'
                                                        onChange={async (e) => {
                                                            const url = (await sendPhoto(e, setModal)).result
                                                            const copy = { ...sectionContent }
                                                            copy.data[input.titleEn].src = url
                                                            setSectionContent(copy)
                                                        }} />
                                                </div>
                                            </div>)
                                        }

                                    })}

                                    {sectionContent.type === "array" && sectionContent.data && sectionContent.data && sectionContent.inputs.map((input, i) => {

                                        if (input.type === "text" || input.type === "number") {
                                            return (
                                                <div key={i}>
                                                    <div className="admin_panel_right_add_title">{input.title}:</div>
                                                    {input.type === "text"
                                                        ?
                                                        <textarea
                                                            className="textarea_small"
                                                            type="text"
                                                            placeholder="текст"
                                                            value={sectionContent.data[0][input.titleEn]}
                                                            onChange={(e => {
                                                                const copy = { ...sectionContent }
                                                                copy.data[0][input.titleEn] = e.target.value
                                                                setSectionContent(copy)
                                                            })}
                                                        />
                                                        :
                                                        <input
                                                            className="input input_small"
                                                            type="number"
                                                            placeholder="число"
                                                            value={sectionContent.data[0][input.titleEn]}
                                                            onChange={(e => {
                                                                const copy = { ...sectionContent }
                                                                copy.data[0][input.titleEn] = e.target.value
                                                                setSectionContent(copy)
                                                            })} />
                                                    }
                                                </div>
                                            )
                                        }

                                        if (input.type === "img") {
                                            return (
                                                <div key={i}>
                                                    <div className="admin_panel_right_add_title">{input.title}:</div>
                                                    {sectionContent.data[0][input.titleEn].src &&
                                                        <img
                                                            className="admin_panel_right_add_img"
                                                            src={`${CONSTS.BACKEND_URL}/${sectionContent.data[0][input.titleEn].src}`}
                                                        />
                                                    }

                                                    <div className="admin_panel_right_add_inputs">
                                                        <input
                                                            className="input input_small"
                                                            type="text"
                                                            placeholder="название картинки"
                                                            value={sectionContent.data[0][input.titleEn].alt}
                                                            onChange={(e => {
                                                                const copy = { ...sectionContent }
                                                                copy.data[0][input.titleEn].alt = e.target.value
                                                                setSectionContent(copy)
                                                            })} />

                                                        <input
                                                            className="input_file"
                                                            type='file'
                                                            name='file'
                                                            onChange={async (e) => {
                                                                const url = (await sendPhoto(e, setModal)).result
                                                                const copy = { ...sectionContent }
                                                                copy.data[0][input.titleEn].src = url
                                                                setSectionContent(copy)
                                                            }} />
                                                    </div>

                                                </div>
                                            )
                                        }
                                    }
                                    )}

                                    {sectionContent.type === "array" &&
                                        <button
                                            className="btn"
                                            onClick={async () => {
                                                await addData(sectionContent, setModal)
                                                await getSection(setSectionContent, setModal)
                                            }}
                                        >Добавить</button>
                                    }

                                    {sectionContent.type === "object" &&
                                        <button
                                            className="btn"
                                            onClick={async () => {
                                                await updateData(sectionContent, setModal)
                                                await getSection(setSectionContent, setModal)
                                            }}
                                        >Изменить</button>
                                    }


                                    {sectionContent.type === "array" && sectionContent.data && sectionContent.data.slice(1).map((content, i) => {
                                        return (
                                            <div key={i} className="admin_panel_right_add_block">
                                                {Object.keys(content).map((key, j) => {
                                                    const value = content[key]
                                                    if (typeof value === "string") {
                                                        return (
                                                            <div key={j}>
                                                                {sectionContent.inputs.map((input, k) => input.titleEn === key && <div className="admin_panel_right_add_title" key={k}>{input.title}:</div>)}
                                                                {sectionContent.inputs.map((input, k) => {
                                                                    if (input.titleEn === key) {
                                                                        return (
                                                                            input.type === "text"
                                                                                ?
                                                                                <textarea
                                                                                    key={k}
                                                                                    className="textarea_small"
                                                                                    type="text"
                                                                                    placeholder="текст"
                                                                                    value={content[key]}
                                                                                    onChange={(e => {
                                                                                        const copy = { ...sectionContent }
                                                                                        copy.data[i + 1][key] = e.target.value
                                                                                        setSectionContent(copy)
                                                                                    })}
                                                                                />
                                                                                :
                                                                                <input
                                                                                    key={k}
                                                                                    className="input input_small"
                                                                                    type="number"
                                                                                    placeholder="число"
                                                                                    value={content[key]}
                                                                                    onChange={(e => {
                                                                                        const copy = { ...sectionContent }
                                                                                        copy.data[i + 1][key] = e.target.value
                                                                                        setSectionContent(copy)
                                                                                    })} />
                                                                        )
                                                                    }
                                                                })}
                                                            </div>
                                                        )
                                                    }

                                                    if (typeof value === "object") {
                                                        return (
                                                            <div key={j}>
                                                                {sectionContent.inputs.map((input, i) => input.titleEn === key && <div className="admin_panel_right_add_title" key={i}>{input.title}:</div>)}
                                                                <img
                                                                    className="admin_panel_right_add_img"
                                                                    src={`${CONSTS.BACKEND_URL}/${sectionContent.data[i + 1][key].src}`}
                                                                />
                                                                <div className="admin_panel_right_add_inputs">
                                                                    <input
                                                                        className="input input_small"
                                                                        type="text"
                                                                        placeholder="название картинки"
                                                                        value={sectionContent.data[i + 1][key].alt}
                                                                        onChange={(e => {
                                                                            const copy = { ...sectionContent }
                                                                            copy.data[i + 1][key].alt = e.target.value
                                                                            setSectionContent(copy)
                                                                        })} />
                                                                    <input
                                                                        className="input_file"
                                                                        type='file'
                                                                        name='file'
                                                                        onChange={async (e) => {
                                                                            const url = (await sendPhoto(e, setModal)).result
                                                                            const copy = { ...sectionContent }
                                                                            copy.data[i + 1][key].src = url
                                                                            setSectionContent(copy)
                                                                        }} />
                                                                </div>

                                                            </div>
                                                        )
                                                    }
                                                })}

                                                <div className="btns_group">
                                                    <button
                                                        className="btn"
                                                        onClick={async () => {
                                                            await updateData(sectionContent, setModal)
                                                            await getSection(setSectionContent, setModal)
                                                        }}
                                                    >Изменить</button>

                                                    <button
                                                        className="btn"
                                                        onClick={async () => {
                                                            const copy = { ...sectionContent }
                                                            copy.data = sectionContent.data.filter((el, index) => index !== i + 1)
                                                            await updateData(copy, setModal)
                                                            await getSection(setSectionContent, setModal)
                                                        }}
                                                    >Удалить</button>
                                                </div>
                                            </div>

                                        )

                                    })}

                                </div>} {/* </MainArea> */}
                        </div>
                    </div>
                </div >
            </>
        )
    }

    return <><div>Упс...</div><div>Что-то пошло не так. Сообщите программисту об ошибке</div></>
}

const isLogin = () => {
    if (Number(getLastTimeInPanelFromLocalStorage()) + 24 * 60 * 60 * 1000 > Date.now()) return true
    else return false
}

const setLastTimeInPanelInLocalStorage = () => {
    localStorage.setItem("last_time", Date.now())
}

const getLastTimeInPanelFromLocalStorage = () => {
    return localStorage.getItem("last_time")
}

const setPageInLocalStorage = (page) => {
    localStorage.setItem("page", page ? page : "login")
}

const getPageFromLocalStorage = () => {
    return localStorage.getItem("page")
}

const setCurrentPageInLocalStorage = (current_page) => {
    localStorage.setItem("current_page", current_page)
}

const getCurrentPageFromLocalStorage = () => {
    return localStorage.getItem("current_page")
}

const deleteAllFromInLocalStorage = () => {
    localStorage.clear()
    localStorage.setItem("page", "login")
}

const setCurrentSectionInLocalStorage = (current_section) => {
    localStorage.setItem("current_section", current_section)
}

const getCurrentSectionFromLocalStorage = () => {
    return localStorage.getItem("current_section")
}

const deleteCurrentSectionInLocalStorage = () => {
    localStorage.removeItem("current_section")
}

const sendPhoto = async (e, setModal) => {
    try {
        const img = e.target.files[0]
        let formData = new FormData()
        formData.append('file', img)
        const res = await fetch(`${CONSTS.BACKEND_URL}/upload`, { method: 'POST', body: formData, })
        return await res.json()
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 001", status: false })
    }
}

const login = async (state, setState, setPageName, setCurrentPage, setPageContent, setPages, setSections,) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/login`, { login: state.login, password: state.password })
        if (res.status) {
            setState({ login: "", password: "", error: "" })
            // setPageInLocalStorage("+")
            // setPageName("+")

            setPageContent({ pageName: "", pageNameEn: "" })
            setPageInLocalStorage("add_page")
            setPageName("add_page")
            setCurrentPage("+")
            setCurrentPageInLocalStorage("+")

            // AAAAAAAAAA
            setLastTimeInPanelInLocalStorage()
            setPageInLocalStorage(getPageFromLocalStorage())
            setPageName(getPageFromLocalStorage())
            refreshPagesList(setPages)
            refreshSectionsList(setSections)
            setCurrentPage(getCurrentPageFromLocalStorage())
            setCurrentSection(getCurrentSectionFromLocalStorage())

        } else setState({ ...state, password: "", error: res.message })
    } catch (err) {
        setState({ ...state, password: "", error: err.message })
    }
}

const createPage = async (state, setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/create-page`, { page_name: state.pageName, page_name_en: state.pageNameEn })
        if (!res.status) setModal({ isShow: true, text: res.message, status: res.status })
        else setModal({ isShow: true, text: "Страница создана", status: res.status })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 002", status: false })
    }
}

const createSection = async (state, setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/create-section`, { page_name_en: getCurrentPageFromLocalStorage(), section_name: state.sectionName, section_name_en: state.sectionNameEn, type: state.type, inputs: state.inputs })
        if (!res.status) setModal({ isShow: true, text: res.message, status: res.status })
        else setModal({ isShow: true, text: "Секция создана", status: res.status })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 003", status: false })
    }
}

const getPage = async (setState, setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/get-page`, { page_name_en: getCurrentPageFromLocalStorage() })
        setState({ id: res.result.id, pageName: res.result.page_name, pageNameEn: res.result.page_name_en })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 004", status: false })
    }
}

const getSection = async (setState, setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/get-section`, { page_name_en: getCurrentPageFromLocalStorage(), section_name_en: getCurrentSectionFromLocalStorage() })
        await setState({ id: res.result.id, sectionName: res.result.section_name, sectionNameEn: res.result.section_name_en, type: res.result.type, inputs: JSON.parse(res.result.inputs), data: JSON.parse(res.result.data) })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 005", status: false })
    }
}

const updatePage = async (state, setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/update-page`, { id: state.id, page_name: state.pageName, page_name_en: state.pageNameEn })
        if (!res.status) setModal({ isShow: true, text: res.message, status: res.status })
        else setModal({ isShow: true, text: "Страница изменена", status: res.status })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 006", status: false })
    }
}

const deletePage = async (setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/delete-page`, { page_name_en: getCurrentPageFromLocalStorage() })
        if (!res.status) setModal({ isShow: true, text: res.message, status: res.status })
        else setModal({ isShow: true, text: "Страница удалена", status: res.status })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 007", status: false })
    }
}

const updateSection = async (state, setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/update-section`, { id: state.id, section_name: state.sectionName, section_name_en: state.sectionNameEn, type: state.type, inputs: JSON.stringify(state.inputs) })
        if (!res.status) setModal({ isShow: true, text: res.message, status: res.status })
        else setModal({ isShow: true, text: "Раздел изменён", status: res.status })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 008", status: false })
    }
}

const deleteSection = async (setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/delete-section`, { section_name_en: getCurrentSectionFromLocalStorage() })
        if (!res.status) setModal({ isShow: true, text: res.message, status: res.status })
        else setModal({ isShow: true, text: "Раздел удалён", status: res.status })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 009", status: false })
    }
}

const addData = async (state, setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/add-data`, { id: state.id, inputs: JSON.stringify(state.inputs), data: JSON.stringify(state.data) })
        if (!res.status) setModal({ isShow: true, text: res.message, status: res.status })
        else setModal({ isShow: true, text: "Данные добавлены", status: res.status })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 010", status: false })
    }
}

const updateData = async (state, setModal) => {
    try {
        const res = await fetchPost(`${CONSTS.BACKEND_URL}/update-data`, { id: state.id, data: JSON.stringify(state.data) })
        if (!res.status) setModal({ isShow: true, text: res.message, status: res.status })
        else setModal({ isShow: true, text: "Данные обновлены", status: res.status })
    } catch (err) {
        setModal({ isShow: true, text: "Упс... что-то пошло не так. Код ошибки: 011", status: false })
    }
}

const refreshPagesList = async (setState) => {
    const res = await fetchGet(`${CONSTS.BACKEND_URL}/get-pages`)
    setState(res.result)
}

const refreshSectionsList = async (setState) => {
    const res = await fetchPost(`${CONSTS.BACKEND_URL}/get-sections`, { page_name_en: getCurrentPageFromLocalStorage() })
    setState(res.result)
}

const fetchGet = async (url) => {
    const res = await fetch(url,
        {
            method: 'GET',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
        }
    )
    return res.json();
}

const fetchPost = async (url, data) => {
    // console.log(url, data)
    const res = await fetch(url,
        {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        }
    )
    return res.json();
}


{/* <style global jsx>{`
html,
body {
    background: red;
}
`}</style>

<style jsx>{`
.red {
    color: red;
}
`}</style> */} // you need to paste globals.css here