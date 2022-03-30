const express = require('express');
const router = express.Router();

// Database Documents
const Document = require('./Document.js');

// Slug and Text Format
const slugify = require('slugify');
const textFormatting = require('../../../../../config/formatting/textFormatting');

// Sequelize
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//#region DOCUMENTS HOMEPAGE (GET)
router.get('/', (req, res) => {

    let [successAlert, warningAlert, dangerAlert, descriptionAlert] = [req.flash('successAlert'), req.flash('warningAlert'), req.flash('dangerAlert'), req.flash('descriptionAlert')];

    const alert = {
        success: (successAlert == undefined || successAlert.length == 0) ? "" : successAlert, 
        warning: (warningAlert == undefined || warningAlert.length == 0) ? "" : warningAlert, 
        danger: (dangerAlert == undefined || dangerAlert.length == 0) ? "" : dangerAlert,
        description: (descriptionAlert == undefined || descriptionAlert.length == 0) ? "" : descriptionAlert
    };

    res.render('modules/registration/documents/index.ejs', {
        alert
    });
    
});
//#endregion

//#region NEW DOCUMENT (POST/GET)

//#region NEW DOCUMENT (POST)
router.post('/novo', (req, res) => {

    const code = req.body.code.replace(/\s/g, '').toUpperCase();
    const description = textFormatting.name(req.body.description);
    const slug = slugify(description).toUpperCase();

    const {accountingDocument, allowPayment, allowDeletionPayment, blokRepeatNumberingPayment, allowOnlyAdvance, allowReceiving, allowDeletionReceiving, blokRepeatNumberingReceiving, requiredRegisterUnit, fiscalDocument} = req.body;

    let codeError, descriptionError, generalError;

    Document.findOne({ where: { code: code }}).then(document => {

        // CODE ERRORS
        if(code == ""){ codeError = "O código deve ser preenchido..." }
        if(code.length > 4){ codeError = "O código não pode conter mais de 4 carácteres..." }
        if(document){ codeError = "Esse código já está cadastrado no sistema..."; }

        // DESCRIPTION ERRORS
        if(description == ""){ descriptionError = "A descrição deve ser preenchida..." }
        if(description.length > 100){ descriptionError = "A descrição não pode conter mais de 100 carácteres..." }

        if(!codeError && !descriptionError){

            Document.create({
    
                code,
                description,
                slug,
                accountingDocument: Boolean(accountingDocument),
                allowPayment: Boolean(allowPayment), 
                allowDeletionPayment: Boolean(allowDeletionPayment), 
                blokRepeatNumberingPayment: Boolean(blokRepeatNumberingPayment), 
                allowOnlyAdvance: Boolean(allowOnlyAdvance), 
                allowReceiving: Boolean(allowReceiving), 
                allowDeletionReceiving: Boolean(allowDeletionReceiving), 
                blokRepeatNumberingReceiving: Boolean(blokRepeatNumberingReceiving), 
                requiredRegisterUnit: Boolean(requiredRegisterUnit), 
                fiscalDocument: Boolean(fiscalDocument)
    
            }).then((document) => {
    
                if(document){
                    res.redirect(`/cadastros/documentos/id/${document.id}`);
                } else {

                    req.flash('generalError', 'Ocorreu um erro inesperado, tente enviar o formulário novamente ou atualizar a página...');
                    res.redirect('/cadastros/documentos/novo');

                }
    
            }).catch(() => {

                req.flash('generalError', 'Ocorreu um erro inesperado, tente enviar o formulário novamente ou atualizar a página...');
                res.redirect('/cadastros/documentos/novo');

            });

        } else {

            //#region ERROR VALUES
            req.flash('codeError', codeError);
            req.flash('descriptionError', descriptionError);
            req.flash('generalError', generalError);
            //#endregion

            //#region FORM VALUES
            req.flash('code', code);
            req.flash('description', description);
            req.flash('accountingDocument', accountingDocument);
            req.flash('allowPayment', allowPayment);
            req.flash('allowDeletionPayment', allowDeletionPayment);
            req.flash('blokRepeatNumberingPayment', blokRepeatNumberingPayment);
            req.flash('allowOnlyAdvance', allowOnlyAdvance);
            req.flash('allowReceiving', allowReceiving);
            req.flash('allowDeletionReceiving', allowDeletionReceiving);
            req.flash('blokRepeatNumberingReceiving', blokRepeatNumberingReceiving);
            req.flash('requiredRegisterUnit', requiredRegisterUnit);
            req.flash('fiscalDocument', fiscalDocument);
            //#endregion

            res.redirect('/cadastros/documentos/novo');

        }

    }).catch(() => {

        req.flash('generalError', 'Ocorreu um erro inesperado, tente enviar o formulário novamente ou atualizar a página...');
        res.redirect('/cadastros/documentos/novo');

    });
});
//#endregion

//#region NEW DOCUMENT PAGE (GET)
router.get('/novo', (req, res) => {

    let [codeError, descriptionError, generalError] = [req.flash('codeError'), req.flash('descriptionError'), req.flash('generalError')];

    const error = {
        codeError: (codeError == undefined || codeError.length == 0) ? undefined : codeError,
        descriptionError: (descriptionError == undefined || descriptionError.length == 0) ? undefined : descriptionError,
        generalError: (generalError == undefined || generalError.length == 0) ? undefined : generalError,
    }

    const loadError = (error.codeError || error.descriptionError || error.generalError) ? true : false;

    let form;

    if(loadError){

        let [code, description, accountingDocument, allowPayment, allowDeletionPayment, blokRepeatNumberingPayment, allowOnlyAdvance, allowReceiving, allowDeletionReceiving, blokRepeatNumberingReceiving, requiredRegisterUnit, fiscalDocument] = [req.flash('code'), req.flash('description'), req.flash('accountingDocument'), req.flash('allowPayment'), req.flash('allowDeletionPayment'), req.flash('blokRepeatNumberingPayment'), req.flash('allowOnlyAdvance'), req.flash('allowReceiving'), req.flash('allowDeletionReceiving'), req.flash('blokRepeatNumberingReceiving'), req.flash('requiredRegisterUnit'), req.flash('fiscalDocument')];

        form = {
            code: (code == undefined || code.length == 0) ? "" : code, 
            description: (description == undefined || description.length == 0) ? "" : description, 
            accountingDocument: (accountingDocument == undefined || accountingDocument.length == 0) ? false : true, 
            allowPayment: (allowPayment == undefined || allowPayment.length == 0) ? false : true, 
            allowDeletionPayment: (allowDeletionPayment == undefined || allowDeletionPayment.length == 0) ? false : true, 
            blokRepeatNumberingPayment: (blokRepeatNumberingPayment == undefined || blokRepeatNumberingPayment.length == 0) ? false : true, 
            allowOnlyAdvance: (allowOnlyAdvance == undefined || allowOnlyAdvance.length == 0) ? false : true, 
            allowReceiving: (allowReceiving == undefined || allowReceiving.length == 0) ? false : true, 
            allowDeletionReceiving: (allowDeletionReceiving == undefined || allowDeletionReceiving.length == 0) ? false : true, 
            blokRepeatNumberingReceiving: (blokRepeatNumberingReceiving == undefined || blokRepeatNumberingReceiving.length == 0) ? false : true, 
            requiredRegisterUnit: (requiredRegisterUnit == undefined || requiredRegisterUnit.length == 0) ? false : true, 
            fiscalDocument: (fiscalDocument == undefined || fiscalDocument.length == 0) ? false : true
        }
    }

    res.render('modules/registration/documents/new.ejs', {
        error,
        loadError,
        alert: {},
        form
    });

});
//#endregion

//#endregion

//#region VIEW AND EDIT DOCUMENT (POST/GET)

//#region EDIT DOCUMENT (POST)
router.post('/id/:id', (req, res) => {

    // DOCUMENT ID
    const id = Number(req.params.id) || -1;

    const description = textFormatting.name(req.body.description);
    const slug = slugify(description).toUpperCase();

    // DESCRIPTION ERRORS
    let descriptionError;

    if(description == ""){ descriptionError = "- A descrição não foi preenchida" }
    if(description.length > 100){ descriptionError = "- A descrição não pode conter mais de 100 carácteres" }

    if(!descriptionError){

        const {accountingDocument, allowPayment, allowDeletionPayment, blokRepeatNumberingPayment, allowOnlyAdvance, allowReceiving, allowDeletionReceiving, blokRepeatNumberingReceiving, requiredRegisterUnit, fiscalDocument} = req.body;

        Document.update({

            description: description,
            slug: slug,
            accountingDocument: Boolean(accountingDocument),
            allowPayment: Boolean(allowPayment), 
            allowDeletionPayment: Boolean(allowDeletionPayment), 
            blokRepeatNumberingPayment: Boolean(blokRepeatNumberingPayment), 
            allowOnlyAdvance: Boolean(allowOnlyAdvance), 
            allowReceiving: Boolean(allowReceiving), 
            allowDeletionReceiving: Boolean(allowDeletionReceiving), 
            blokRepeatNumberingReceiving: Boolean(blokRepeatNumberingReceiving), 
            requiredRegisterUnit: Boolean(requiredRegisterUnit), 
            fiscalDocument: Boolean(fiscalDocument)

        }, {where: {id: id} }).then((document) => {

            if(document[0] > 0){

                req.flash('successAlert', "O documento foi editado com sucesso!");

                res.redirect(`/cadastros/documentos/id/${id}`);

            } else {

                req.flash('warningAlert', 'O documento editado foi apagado ou não pôde ser encontrado pelo sistema...');

                res.redirect('/cadastros/documentos');

            }

        }).catch(() => {

            req.flash('dangerAlert', "Ocorreu um erro insesperado, atualize a página e tente realizar a edição novamente!");

            res.redirect(`/cadastros/documentos/id/${id}`);

        });

    } else {

        req.flash('dangerAlert', 'O documento não pôde ser editado pois:');

        req.flash('descriptionAlert', descriptionError);

        res.redirect(`/cadastros/documentos/id/${id}`);

    }

});
//#endregion

//#region DOCUMENT INFORMATION PAGE (GET)
router.get('/id/:id', (req, res) => {
    
    const id = Number(req.params.id) || -1;

    Document.findByPk(id).then(document => {

        if(document){

            let [successAlert, warningAlert, dangerAlert, descriptionAlert] = [req.flash('successAlert'), req.flash('warningAlert'), req.flash('dangerAlert'), req.flash('descriptionAlert')];

            const alert = {
                success: (successAlert == undefined || successAlert.length == 0) ? "" : successAlert, 
                warning: (warningAlert == undefined || warningAlert.length == 0) ? "" : warningAlert, 
                danger: (dangerAlert == undefined || dangerAlert.length == 0) ? "" : dangerAlert,
                description: (descriptionAlert == undefined || descriptionAlert.length == 0) ? "" : descriptionAlert
            };
            
            res.render('modules/registration/documents/edit.ejs', {
                error: {},
                loadError: false,
                alert,
                form: document
            });

        } else {

            req.flash('warningAlert', "O documento não foi encontrado, ele pode ter sido apagado ou não ter sido cadastrado no sistema...");

            res.redirect('/cadastros/documentos');

        }

    }).catch(() => {

        req.flash('dangerAlert', "Ocorreu um erro insesperado ao carregar o documento, tente acessá-lo novamente pela consulta...");

        res.redirect('/cadastros/documentos');

    });

});
//#endregion

//#endregion

//#region DELETE DOCUMENT (POST)
router.post('/id/:id/deletar', (req, res) => {

    // IMPLEMENTAR PESQUISA DE TÍTULOS QUE POSSAM CONTER ESSE DOCUMENTO, SE EXISTIR A DELEÇÃO NÃO PODE SER REALIZADA. Ex.
    // Titles.findOne({ where: { documentId: id } }).then((title) => {}).catch(() => {}) 

    const id = Number(req.params.id) || -1;

    Document.destroy({ where: { id: id } }).then((count) => {

        if(count > 0){

            req.flash('successAlert', "O documento foi apagado com sucesso!");

            res.redirect(`/cadastros/documentos`);

        } else {

            req.flash('warningAlert', 'O documento já havia sido apagado anteriormente ou não pôde ser encontrado pelo sistema...');

            res.redirect('/cadastros/documentos');

        }

    }).catch(() => {

        req.flash('dangerAlert', "Ocorreu um erro insesperado ao tentar excluir o documento, consulte este e tente realizar a deleção novamente...");

        res.redirect('/cadastros/documentos');

    });
});
//#endregion

//#region DOCUMENT SEARCH FUNCTIONS (POST)

//#region COUNT DOCUMENTS IN DATABASE (POST)
router.post('/search/count', (req, res) => {

    Document.count().then((count) => {

        res.json({ count });

    }).catch(() => {

        res.json({ count: 0 });

    })
    
});
//#endregion

//#region SEARCH DOCUMENT BY ID (POST)
router.post('/search/id', (req, res) => {

    const id = Number(req.body.id) || -1;

    Document.findByPk(id).then(document => {

        document ? res.json(document) : res.json({});

    }).catch(() => {

        res.json({});

    });
});
//#endregion

//#region SEARCH ALL DOCUMENTS (POST) 
router.post('/search/all', (req, res) => {

    const offset = Number(req.body.offset) || 0;
    const limit = Number(req.body.limit) || 20;

    Document.findAndCountAll({

        limit,
        offset,
        order: [['id', 'DESC']]

    }).then((documents) => {

        documents ? res.json(documents) : res.json({});

    }).catch(() => {

        res.json({});

    })
})
//#endregion

//#region SEARCH DOCUMENT BY CODE AND DESCRIPTION (GENERAL SEARCH) (POST)
router.post('/search', (req, res) => {

    const code = req.body.code.replace(/\s/g, '').toUpperCase() || "";
    const descriptionSlug = slugify(req.body.description).toUpperCase() || "";

    Document.findAll({
        where: {
            [Op.and]: [
                {
                    code: {
                        [Op.like]: `${code}%`
                    }
                },
                {
                    slug: {
                        [Op.like]: `%${descriptionSlug}%`
                    }
                }
            ]
        }
    }).then((documents) => {

        documents ? res.json(documents) : res.json({});

    }).catch(() => {

        const documents = {};
        res.json(documents);

    })
})
//#endregion

//#region SEARCH DOCUMENT BY CODE (POST)
router.post('/search/code', (req, res) => {

    const code = req.body.code.replace(/\s/g, '').toUpperCase() || "";

    Document.findOne({ where: { code: code } }).then(document => {

        document ? res.json(document) : res.json({});

    }).catch(() => {
        res.json({});
    });

});
//#endregion

//#region SEARCH DOCUMENT BY DESCRIPTION (POST)
router.post('/search/description', (req, res) => {

    const descriptionSlug = slugify(req.body.description).toUpperCase() || "";

    Document.findAll({
        where: {
            slug: {
                [Op.like]: `%${descriptionSlug}%`
            }
        }
    }).then((documents) => {

        documents ? res.json(documents) : res.json({});

    }).catch(() => {
        res.json({});
    })

})
//#endregion

//#endregion

module.exports = router;