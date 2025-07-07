import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#eeeeee',
    flexDirection: 'column',
    
  },
  container: {
    margin: 10,
    padding: 10,
    borderColor: '#eeeeee',
    borderWidth: 5,
    borderStyle: 'solid',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
    rowGap: 50,
  },
  title: {
    fontSize: 32
  },
  section: {
    padding: 10,
    justifyContent: 'center'
  },
  content: {
    fontSize: 18,
    lineHeight: 1.8
  },
  image: {
    borderColor: '#cbcbcb',
    borderWidth: 2,
    borderStyle: 'solid'
   }
})

type props = {
  noteName?: string,
  noteContent: string[], 
  noteDrawnContent?: string,
  noteUploadedImage?: string
}

function NotePdf({noteName, noteContent, noteDrawnContent, noteUploadedImage}: props) {


  return (
        <Document>
            <Page size={'A4'} style={styles.page}>
                <View style={styles.container}>
                    {noteName && <Text style={styles.title}>{noteName}</Text>}
                    <View style={styles.section}>
                        <Text style={styles.content}>
                          {noteContent.map((line: string) => {
                            return (
                              <>
                                <Text style={styles.content}>{line}</Text>
                                {'\n'}
                              </>
                            )
                          })}
                        </Text>
                    </View>
                    {noteDrawnContent && (
                      <View style={styles.section}>
                        <Image style={styles.image} src={noteDrawnContent} ></Image>
                      </View>
                    )}
                    {noteUploadedImage && (
                      <View style={styles.section}>
                        <Image style={styles.image} src={noteUploadedImage} ></Image>
                      </View>
                    )}
                </View>
                
            </Page>
        </Document>
    
  )
}

export default NotePdf;