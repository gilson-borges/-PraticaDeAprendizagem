const express = require('express');
const router = express.Router();

// Database Documents
const Document = require('./Document.js');

// Slug and Text Format
const slugify = require('slugify');
const textFormatting = require('../../../../config/formatting/textFormatting');

// Sequelize
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

//#region DOCUMENTS HOME PAGE
router.get('/', (req, res) => {
    res.render('modules/registration/documents/index.ejs');
});
//#endregion

//#region DOCUMENT SEARCH FUNCTIONS

//#region COUNT DOCUMENTS IN DATABASE
router.post('/search/count', (req, res) => {

    Document.count().then((count) => {

        res.json({ count });

    }).catch(() => {

        res.json({ count: 0 });

    })
    
});
//#endregion

//#region SEARCH DOCUMENT BY ID
router.post('/search/id', (req, res) => {

    const id = Number(req.body.id) || -1;

    Document.findByPk(id).then(document => {

        document ? res.json(document) : res.json({});

    }).catch(() => {

        res.json({});

    });
});
//#endregion

//#region SEARCH ALL DOCUMENTS 
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

//#region SEARCH DOCUMENT BY CODE AND DESCRIPTION (GENERAL SEARCH)
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

//#region SEARCH DOCUMENT BY CODE
router.post('/search/code', (req, res) => {

    const code = req.body.code.replace(/\s/g, '').toUpperCase() || "";

    Document.findOne({ where: { code: code } }).then(document => {

        document ? res.json(document) : res.json({});

    }).catch(() => {
        res.json({});
    });

});
//#endregion

//#region SEARCH DOCUMENT BY DESCRIPTION
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

//#region NEW DOCUMENT

//#region NEW DOCUMENT PAGE
router.get('/novo', (req, res) => {
    res.render('modules/registration/documents/new.ejs');
});
//#endregion

//#region SAVE NEW DOCUMENT
router.post('/novo', (req, res) => {

    const code = req.body.code.replace(/\s/g, '').toUpperCase();
    const description = textFormatting.name(req.body.description);
    const slug = slugify(description).toUpperCase();

    const {accountingDocument, allowPayment, allowDeletionPayment, blokRepeatNumberingPayment, allowOnlyAdvance, allowReceiving, allowDeletionReceiving, blokRepeatNumberingReceiving, requiredRegisterUnit, fiscalDocument} = req.body;

    Document.findOne({ where: {
        [Op.or]: [
            { code: code },
            { slug: slug }
        ]
    }}).then(document => {

        if(document){

            res.redirect('/cadastros/documentos/novo');

        } else {
            
            if(code != "" && code.length <= 4 && description != "" && description.length <= 100){

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
                        res.redirect('/cadastros/documentos/novo');
                    }
        
                }).catch(() => {
                    res.redirect('/cadastros/documentos/novo');
                });
            
            } else {
                res.redirect('/cadastros/documentos/novo');
            }
        }

    }).catch(() => {
        res.redirect('/cadastros/documentos/novo');
    });
});
//#endregion

//#endregion

//#region VIEW AND EDIT DOCUMENT

//#region DOCUMENT INFORMATION PAGE
router.get('/id/:id', (req, res) => {
    
    const id = Number(req.params.id) || -1;

    Document.findByPk(id).then(document => {

        if(document){
            
            res.render('modules/registration/documents/edit.ejs', {
                document
            });

        } else {
            res.redirect('/cadastros/documentos');
        }

    }).catch(() => {
        res.redirect('/cadastros/documentos');
    });

});
//#endregion

//#region EDIT DOCUMENT
router.post('/id/:id', (req, res) => {

    const id = Number(req.params.id) || -1;

    const description = textFormatting.name(req.body.description);
    const slug = slugify(description).toUpperCase();

    const {accountingDocument, allowPayment, allowDeletionPayment, blokRepeatNumberingPayment, allowOnlyAdvance, allowReceiving, allowDeletionReceiving, blokRepeatNumberingReceiving, requiredRegisterUnit, fiscalDocument} = req.body;

    if(description != "" && description.length <= 100){

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

        }, {where: {id: id}}).then(() => {

            res.redirect(req.get('referer'));

        }).catch(() => {

            res.redirect(req.get('referer'));

        });

    } else {
        res.redirect(req.get('referer'));
    }
});
//#endregion

//#region DELETE DOCUMENT
router.post('/id/:id/deletar', (req, res) => {

    const id = Number(req.params.id) || -1;

    Document.destroy({ where: { id: id } }).then(() => {

        res.redirect('/cadastros/documentos/novo');

    }).catch(() => {

        res.redirect(req.get('referer'));

    });
});
//#endregion

//#endregion

module.exports = router;