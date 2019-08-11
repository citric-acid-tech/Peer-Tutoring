import java.io.*;
import java.util.*;
public class AddLang {

	private static BufferedReader buf;
	private static boolean run = true;
	
	public static void main(String[] args) throws Exception{
		File file = new File("dev_tool_addLang_setting.txt");
		if(!file.exists()) {
			try {
				file.createNewFile();
			} catch (IOException e) {
				// Do nothing
			}
		}
		
		String path = null;
		
		try {
			buf = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
			path = buf.readLine();
		} catch (FileNotFoundException e) {
			alertln("File is not found. Please use command 'set' to update a correst path." );
		} catch (IOException e) {
			// do nothing;
		}
		
		@SuppressWarnings("resource")
		Scanner scan = new Scanner(System.in);
		String command = null;
		
		String variableName = null;
		String content = null;

		while(run){
			command = scan.nextLine();
			if(command.equals("set")) {
				alertln("Please input the path of the language file. For example: 'C:\\Peer-tutoring\\src\\application\\language'.");
				command = scan.nextLine();
				
				setPath(command);
				
				buf = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
				path = buf.readLine();
				
			}else if(command.equals("insert")) {
				
				alertln("Inout the name of the variable:");
				
				variableName = scan.nextLine();
				
				alertln("Input content:");
				
				content = scan.nextLine();
				
				insert(path, variableName, content);
				
				
			}else if(command.equals("quit")) {
				return ;
			}else {
				alertln("Invalid command. The current valid commands are 'set', 'quit' and 'insert'. For more details, please refer to 'README'. ");
			}
		}
		
		scan.close();
	}
	
	public static void setPath(String path) {
		PrintWriter out = null;
		try {
			out = new PrintWriter(new File("dev_tool_addLang_setting.txt"));
		} catch (FileNotFoundException e) {
			// Do nothing
		}
		out.println(path);
		out.close();
	}
	
	public static void insert(String path, String variableName, String content) {
		String line = String.format("$lang['%s'] = '%s';", variableName, content);
		
		File langFile = new File(path);
		File cur = null;
		String curPath = null;
		for(File file : langFile.listFiles()) {
			curPath = file.toString()+"\\translations_lang.php";
			cur = new File(curPath);
			try {
				safeAppend(cur, line);
			} catch (Exception e) {
				// do nothing
			}
		}
		
	}
	
	static void safeAppend(File file, String line) throws Exception{
		BufferedReader bufr = null;
		try {
			bufr = new BufferedReader(new InputStreamReader(new FileInputStream(file)));
		} catch (FileNotFoundException e) {
			// do nothing;
		}
		
		ArrayList<String> buffer = new ArrayList<String>();
		
		String readLine = null;
		while( (readLine = bufr.readLine()) != null ) {
			buffer.add(readLine);
		}
		
		PrintWriter out = new PrintWriter(file);
		for(String bufLine : buffer) {
			out.println(bufLine);
		}
		
		// Append the content
		out.println(line);
		out.flush();
		out.close();
		
	}
	
	static void alertln(String content){
		System.out.println("<Dolores> "+content);
	}
}