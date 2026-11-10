#!/usr/bin/env python3
"""Builds public/data/words.json — Astrolab's spelling library.

Words and sentences are written for this project (original content), grouped by
school level and spelling topic.  British/American pairs are marked so the
player can switch convention.
"""
import json, os

W = []


def w(word, level, topic, definition, sentence, locale="both", note=""):
    W.append({"w": word, "level": level, "topic": topic, "def": definition,
              "sent": sentence, "locale": locale, "note": note})


# ---- common vocabulary -----------------------------------------------------
w("because", "beginner", "common", "for the reason that", "I stayed inside because it was raining.")
w("friend", "beginner", "common", "a person you like and trust", "My friend lives next door.")
w("people", "beginner", "common", "more than one person", "Lots of people came to the match.")
w("again", "beginner", "common", "one more time", "Can we play that again?")
w("school", "beginner", "common", "a place where children learn", "Our school has a new library.")
w("night", "beginner", "common", "the dark part of the day", "The stars come out at night.")
w("light", "beginner", "common", "brightness that lets you see", "Switch on the light, please.")
w("water", "beginner", "common", "the clear liquid we drink", "Drink plenty of water after sport.")
w("world", "beginner", "common", "the earth and everything on it", "She wants to travel the world.")
w("animal", "beginner", "common", "a living creature that is not a plant", "The fox is my favourite animal.")
w("family", "beginner", "common", "parents, children and relatives", "My family eats together on Sundays.")
w("little", "beginner", "common", "small in size", "A little bird sat on the wall.")
w("beautiful", "intermediate", "common", "very pleasing to look at", "The sunset was beautiful.")
w("different", "intermediate", "common", "not the same", "Every snowflake is different.")
w("important", "intermediate", "common", "mattering a lot", "It is important to listen carefully.")
w("remember", "intermediate", "common", "to keep something in your mind", "Remember to bring your kit.")
w("question", "intermediate", "common", "something you ask", "Nobody knew the answer to the question.")
w("answer", "beginner", "common", "a reply to a question", "Write your answer on the line.")
w("weather", "intermediate", "common", "the state of the sky and air", "The weather changed at lunchtime.")
w("holiday", "intermediate", "common", "time away from school or work", "We went to the coast for the holiday.", "GB")
w("vacation", "intermediate", "common", "time away from school or work", "We went to the coast for vacation.", "US")
w("describe", "intermediate", "common", "to say what something is like", "Describe the room in three sentences.")
w("discover", "advanced", "common", "to find something for the first time", "They discovered a new cave.")
w("curiosity", "advanced", "common", "the wish to know or learn", "Her curiosity led her to the telescope.")
w("generous", "advanced", "common", "happy to give to others", "He was generous with his time.")
w("ordinary", "advanced", "common", "normal, not special", "It looked like an ordinary stone.")
w("peculiar", "advanced", "common", "strange or unusual", "There was a peculiar smell in the attic.")
w("reluctant", "expert", "common", "not wanting to do something", "She was reluctant to speak first.")
w("meticulous", "expert", "common", "very careful about detail", "His notes were meticulous.")

# ---- commonly misspelled ---------------------------------------------------
w("separate", "intermediate", "misspelled", "to divide or keep apart", "Separate the white clothes from the colours.")
w("definitely", "intermediate", "misspelled", "without any doubt", "I will definitely come on Saturday.")
w("necessary", "intermediate", "misspelled", "needed", "A pen is necessary for the test.")
w("accommodate", "advanced", "misspelled", "to make room for", "The hall can accommodate two hundred people.")
w("embarrass", "advanced", "misspelled", "to make someone feel shy", "Do not embarrass him in front of the class.")
w("occurrence", "advanced", "misspelled", "something that happens", "Rain in July is a rare occurrence.")
w("recommend", "advanced", "misspelled", "to suggest as a good idea", "I recommend the second book.")
w("rhythm", "advanced", "misspelled", "a regular pattern of beats", "The drummer kept a steady rhythm.")
w("business", "intermediate", "misspelled", "work done to make or sell things", "The shop is a family business.")
w("really", "beginner", "misspelled", "truly", "That was really kind of you.")
w("until", "beginner", "misspelled", "up to the time that", "Wait here until I come back.")
w("believe", "beginner", "misspelled", "to think something is true", "I believe you.")
w("calendar", "intermediate", "misspelled", "a chart of the days of the year", "Mark the date on the calendar.")
w("February", "intermediate", "misspelled", "the second month", "February is the shortest month.")
w("Wednesday", "beginner", "misspelled", "the middle day of the week", "We have science on Wednesday.")
w("exercise", "intermediate", "misspelled", "activity that keeps you healthy", "Exercise makes your heart stronger.")
w("favourite", "beginner", "misspelled", "liked more than others", "Purple is my favourite colour.", "GB")
w("favorite", "beginner", "misspelled", "liked more than others", "Purple is my favorite color.", "US")
w("argument", "advanced", "misspelled", "a disagreement or a reason given", "They won the argument with evidence.")
w("independent", "advanced", "misspelled", "not controlled by anyone else", "She is an independent thinker.")
w("apparent", "expert", "misspelled", "clear or obvious", "It was apparent that he had practised.")
w("conscience", "expert", "misspelled", "the sense of right and wrong", "His conscience told him to confess.")

# ---- homophones ------------------------------------------------------------
w("their", "beginner", "homophones", "belonging to them", "Their house is by the park.")
w("there", "beginner", "homophones", "in that place", "Put the box over there.")
w("they're", "beginner", "homophones", "short for 'they are'", "They're coming at six.")
w("your", "beginner", "homophones", "belonging to you", "Bring your boots.")
w("you're", "beginner", "homophones", "short for 'you are'", "You're next in the queue.")
w("to", "beginner", "homophones", "towards", "We walked to the beach.")
w("too", "beginner", "homophones", "also, or more than needed", "It is too hot to run.")
w("two", "beginner", "homophones", "the number 2", "I have two sisters.")
w("its", "intermediate", "homophones", "belonging to it", "The dog wagged its tail.")
w("it's", "intermediate", "homophones", "short for 'it is'", "It's nearly lunchtime.")
w("peace", "intermediate", "homophones", "calm and quiet", "The village is full of peace.")
w("piece", "intermediate", "homophones", "a part of something", "Take a piece of cake.")
w("break", "beginner", "homophones", "to make something come apart", "Do not break the glass.")
w("brake", "intermediate", "homophones", "a part that stops a vehicle", "Press the brake gently.")
w("weather", "intermediate", "homophones", "conditions outside", "Bad weather stopped the ferry.")
w("whether", "intermediate", "homophones", "if, or which of two", "I do not know whether to go.")
w("which", "beginner", "homophones", "asking about a choice", "Which coat is yours?")
w("witch", "beginner", "homophones", "a magic character", "The witch had a black cat.")
w("heard", "intermediate", "homophones", "past of 'hear'", "I heard the bell from the field.")
w("herd", "advanced", "homophones", "a group of animals", "A herd of deer crossed the road.")
w("plane", "beginner", "homophones", "an aircraft", "The plane left the runway.")
w("plain", "intermediate", "homophones", "simple, not decorated", "He wore a plain shirt.")
w("practice", "intermediate", "homophones", "to rehearse (or the noun in US)", "Practise every day if you can.", "US")
w("practise", "intermediate", "homophones", "to rehearse (verb, British)", "Practise every day if you can.", "GB")
w("advice", "advanced", "homophones", "a suggestion", "That was useful advice.")
w("advise", "advanced", "homophones", "to give a suggestion", "I advise you to start early.")
w("stationary", "expert", "homophones", "not moving", "The bus stayed stationary at the lights.")
w("stationery", "expert", "homophones", "paper and writing supplies", "She bought stationery for school.")
w("complement", "expert", "homophones", "to go well with", "The scarf complements the coat.")
w("compliment", "expert", "homophones", "a kind remark", "He paid her a compliment.")

# ---- silent letters --------------------------------------------------------
w("knife", "beginner", "silent", "a cutting tool", "The knife is in the drawer.", note="silent k")
w("know", "beginner", "silent", "to have information", "I know the answer.", note="silent k")
w("write", "beginner", "silent", "to put words on paper", "Write your name at the top.", note="silent w")
w("wrong", "beginner", "silent", "not correct", "That is the wrong gate.", note="silent w")
w("lamb", "intermediate", "silent", "a young sheep", "The lamb followed its mother.", note="silent b")
w("thumb", "intermediate", "silent", "the short thick finger", "I trapped my thumb in the door.", note="silent b")
w("castle", "intermediate", "silent", "a strong old building", "The castle stands on the hill.", note="silent t")
w("listen", "beginner", "silent", "to pay attention to sound", "Listen to the instructions.", note="silent t")
w("island", "intermediate", "silent", "land surrounded by water", "We sailed to a small island.", note="silent s")
w("climb", "beginner", "silent", "to go up something", "They climb the hill every Sunday.", note="silent b")
w("science", "intermediate", "silent", "the study of the natural world", "Science is my favourite lesson.", note="silent c after s")
w("debt", "advanced", "silent", "money that must be paid back", "The company fell into debt.", note="silent b")
w("solemn", "expert", "silent", "serious and formal", "There was a solemn silence.", note="silent n")
w("foreign", "intermediate", "silent", "from another country", "She speaks three foreign languages.", note="silent g")
w("receipt", "advanced", "silent", "a proof of payment", "Keep the receipt in case it breaks.", note="silent p")
w("pneumonia", "expert", "silent", "a lung illness", "He missed school with pneumonia.", note="silent p")
w("ghost", "beginner", "silent", "the spirit of a dead person", "The story was about a ghost.", note="silent h")
w("hour", "beginner", "silent", "sixty minutes", "We waited for an hour.", note="silent h")

# ---- prefixes and suffixes -------------------------------------------------
w("impossible", "beginner", "affixes", "cannot be done", "It is impossible to run that fast.", note="prefix im-")
w("unhappy", "beginner", "affixes", "not happy", "He was unhappy about the change.", note="prefix un-")
w("disappear", "intermediate", "affixes", "to stop being seen", "The moon disappeared behind a cloud.", note="prefix dis-")
w("preview", "intermediate", "affixes", "a look at something before it opens", "We saw a preview of the play.", note="prefix pre-")
w("rewrite", "intermediate", "affixes", "to write again", "Rewrite the sentence in the past tense.", note="prefix re-")
w("transport", "intermediate", "affixes", "to carry from one place to another", "Trains transport goods quickly.", note="prefix trans-")
w("happiness", "intermediate", "affixes", "the feeling of being happy", "Music brings her happiness.", note="suffix -ness")
w("careless", "beginner", "affixes", "not taking enough care", "A careless mistake cost them the point.", note="suffix -less")
w("hopeful", "intermediate", "affixes", "feeling that something good may happen", "They were hopeful of a win.", note="suffix -ful")
w("enjoyable", "intermediate", "affixes", "bringing pleasure", "The trip was enjoyable.", note="suffix -able")
w("strength", "advanced", "affixes", "how strong something is", "He has great strength of will.", note="suffix -th")
w("beautifully", "intermediate", "affixes", "in a beautiful way", "She sang beautifully.", note="suffix -ly")
w("misinformation", "expert", "affixes", "false information spread by mistake", "The article repeated misinformation.", note="prefix mis- + -tion")
w("international", "advanced", "affixes", "between many countries", "An international competition was held.", note="prefix inter-")
w("responsibility", "advanced", "affixes", "a duty you are trusted with", "Feeding the pet is my responsibility.", note="suffix -ity")
w("reconstruction", "expert", "affixes", "the act of rebuilding", "The reconstruction took two years.", note="prefix re- + -tion")

# ---- double consonants ----------------------------------------------------
w("letter", "beginner", "double", "a written symbol for a sound", "The letter b starts the word.", note="double t")
w("rabbit", "beginner", "double", "a small animal with long ears", "The rabbit ate the lettuce.", note="double b")
w("dinner", "beginner", "double", "the evening meal", "We had pasta for dinner.", note="double n")
w("happen", "beginner", "double", "to take place", "What will happen next?", note="double p")
w("summer", "beginner", "double", "the warmest season", "Summer started late this year.", note="double m")
w("beginning", "intermediate", "double", "the start of something", "The beginning of the book is slow.", note="double n")
w("different", "intermediate", "double", "not the same", "They chose a different route.", note="double f")
w("tomorrow", "beginner", "double", "the day after today", "See you tomorrow.", note="double m, single r")
w("immediate", "advanced", "double", "happening at once", "The effect was immediate.", note="double m")
w("necessary", "intermediate", "double", "needed", "Two batteries are necessary.", note="single c, double s")
w("occur", "advanced", "double", "to happen", "Accidents can occur here.", note="double c, single r")
w("recommendation", "expert", "double", "a suggestion to do something", "Her recommendation was accepted.", note="single c, double m")
w("anniversary", "advanced", "double", "a yearly date to remember", "They marked their tenth anniversary.", note="double n")
w("appreciate", "advanced", "double", "to be grateful for", "I appreciate your help.", note="double p")
w("possess", "expert", "double", "to own something", "They possess three libraries.", note="double s twice")

# ---- academic vocabulary --------------------------------------------------
w("evidence", "advanced", "academic", "facts that show what is true", "The evidence supported her claim.", "both")
w("analysis", "advanced", "academic", "a careful study of something", "Their analysis of the data was clear.")
w("hypothesis", "expert", "academic", "an idea to be tested", "The experiment tested a simple hypothesis.")
w("conclusion", "advanced", "academic", "a judgement reached at the end", "The report ends with a clear conclusion.")
w("significant", "advanced", "academic", "large enough to matter", "There was a significant improvement.")
w("comparison", "intermediate", "academic", "the act of looking at differences", "The comparison showed two clear trends.")
w("evaluate", "expert", "academic", "to judge the value of something", "Evaluate both sources of information.")
w("summary", "intermediate", "academic", "a short account of the main points", "Write a summary of the chapter.")
w("contrast", "advanced", "academic", "a clear difference", "The contrast between the seasons is striking.")
w("theory", "intermediate", "academic", "an explanation based on evidence", "The theory explains the movement.")
w("describe", "intermediate", "academic", "to say what something is like", "Describe the trend in the graph.")
w("define", "advanced", "academic", "to say exactly what something means", "Define the key term before you use it.")
w("sequence", "advanced", "academic", "things following one after another", "Put the events in the correct sequence.")
w("criteria", "expert", "academic", "standards used to judge", "The work was marked against clear criteria.")
w("method", "intermediate", "academic", "a way of doing something", "Their method was faster than ours.")
w("consequence", "advanced", "academic", "a result of an action", "Every decision has a consequence.")

# ---- scientific vocabulary ------------------------------------------------
w("oxygen", "intermediate", "science", "a gas we need to breathe", "Plants release oxygen.")
w("gravity", "intermediate", "science", "the force that pulls things down", "Gravity keeps us on the ground.")
w("molecule", "advanced", "science", "a group of atoms joined together", "A water molecule has three atoms.")
w("photosynthesis", "advanced", "science", "how plants make food from light", "Photosynthesis needs sunlight and water.")
w("electrical", "intermediate", "science", "relating to electricity", "Check the electrical cables.")
w("temperature", "intermediate", "science", "how hot or cold something is", "The temperature dropped overnight.")
w("skeleton", "intermediate", "science", "the frame of bones in a body", "The skeleton supports the body.")
w("current", "advanced", "science", "a flow of water, air or electricity", "The current in the river is strong.")
w("organism", "advanced", "science", "a living thing", "Every organism needs energy.")
w("microscope", "intermediate", "science", "a tool for looking at tiny things", "Under the microscope the leaf changed.")
w("experiment", "beginner", "science", "a fair test to find something out", "The experiment worked on the second try.")
w("evidence", "advanced", "science", "findings that support an idea", "The evidence pointed to a chemical change.")
w("measurement", "advanced", "science", "the size or amount found by measuring", "Take the measurement twice.")
w("acceleration", "expert", "science", "the rate at which speed changes", "The car's acceleration was smooth.")
w("atmosphere", "advanced", "science", "the air around a planet", "The atmosphere protects the surface.")
w("mammal", "beginner", "science", "a warm-blooded animal with hair", "A whale is a mammal.")

# ---- everyday words -------------------------------------------------------
w("breakfast", "beginner", "everyday", "the first meal of the day", "I have cereal for breakfast.", "both")
w("library", "beginner", "everyday", "a place with books to borrow", "The library opens at nine.")
w("bicycle", "beginner", "everyday", "a two-wheeled machine you pedal", "My bicycle has a new bell.")
w("sandwich", "beginner", "everyday", "food between two slices of bread", "He ate a cheese sandwich.")
w("hundred", "beginner", "everyday", "the number 100", "There are a hundred seats.")
w("behind", "beginner", "everyday", "at the back of something", "Stand behind the line.")
w("telephone", "beginner", "everyday", "a device for talking at a distance", "Answer the telephone, please.")
w("coloured", "beginner", "everyday", "having colour added", "She drew with coloured pencils.", "GB")
w("colored", "beginner", "everyday", "having color added", "She drew with colored pencils.", "US")
w("colour", "beginner", "everyday", "what you see in light", "Blue is a calm colour.", "GB")
w("color", "beginner", "everyday", "what you see in light", "Blue is a calm color.", "US")
w("neighbourhood", "intermediate", "everyday", "the area where you live", "Our neighbourhood has a small park.", "GB")
w("neighborhood", "intermediate", "everyday", "the area where you live", "Our neighborhood has a small park.", "US")
w("travelled", "intermediate", "everyday", "went on a journey (British)", "We travelled by train.", "GB")
w("traveled", "intermediate", "everyday", "went on a journey (American)", "We traveled by train.", "US")
w("centre", "intermediate", "everyday", "the middle part", "Meet me at the centre of the square.", "GB")
w("center", "intermediate", "everyday", "the middle part", "Meet me at the center of the square.", "US")
w("metre", "intermediate", "everyday", "a unit of length", "The pool is twenty-five metres long.", "GB")
w("meter", "intermediate", "everyday", "a unit of length", "The pool is twenty-five meters long.", "US")
w("organise", "intermediate", "everyday", "to plan and arrange", "We must organise the trip.", "GB")
w("organize", "intermediate", "everyday", "to plan and arrange", "We must organize the trip.", "US")

# ---- list definitions (what "complete a word list" means) -----------------
LISTS = [
    {"id": "common", "name": "Common vocabulary", "topic": "common"},
    {"id": "misspelled", "name": "Commonly misspelled", "topic": "misspelled"},
    {"id": "homophones", "name": "Homophones", "topic": "homophones"},
    {"id": "silent", "name": "Silent letters", "topic": "silent"},
    {"id": "affixes", "name": "Prefixes & suffixes", "topic": "affixes"},
    {"id": "double", "name": "Double consonants", "topic": "double"},
    {"id": "academic", "name": "Academic vocabulary", "topic": "academic"},
    {"id": "science", "name": "Scientific vocabulary", "topic": "science"},
    {"id": "everyday", "name": "Everyday words", "topic": "everyday"},
]

# a word may belong to several topics; keep the first entry (its definition and
# level) and record the extra topics so it still turns up in both lists.
seen = {}
deduped = []
for e in W:
    key = (e["w"], e["locale"])
    if key in seen:
        prev = seen[key]
        if e["topic"] not in prev["topics"]:
            prev["topics"].append(e["topic"])
        continue
    e["topics"] = [e["topic"]]
    seen[key] = e
    deduped.append(e)
W = deduped

out = {"words": W, "lists": LISTS,
       "levels": ["beginner", "intermediate", "advanced", "expert"],
       "topics": [l["id"] for l in LISTS]}

here = os.path.dirname(os.path.abspath(__file__))
dest = os.path.join(here, "..", "public", "data", "words.json")
json.dump(out, open(dest, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
print(len(W), "words ->", os.path.normpath(dest))
from collections import Counter
print(Counter(e["topic"] for e in W))
print(Counter(e["level"] for e in W))
