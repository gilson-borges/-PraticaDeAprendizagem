const formatting = {

    name: (text = "") => {
        try {

            let formattedText = "";
            const words = text.replace(/\s{2,}/g, ' ').trim().toLowerCase().split(' ');
            
            if(words[0] !== ""){
                for(let i = 0; i < words.length; i++){
                    formattedText += `${words[i][0].toUpperCase() + words[i].slice(1, words[i].length)} `;
                }
            }
        
            return formattedText.trim();

        } catch(err) {
            return "";
        }
    }
    
};

module.exports = formatting;