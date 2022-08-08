import fi from '../translation/fi.json';

const dictonary = fi;

export function translate(term: string){
    return dictonary[term] || term;
}